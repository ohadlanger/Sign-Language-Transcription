#!/usr/bin/env python

import argparse
import os
from pathlib import Path
from signwriting.formats.swu_to_fsw import swu2fsw

import numpy as np
from pose_format import Pose
from tqdm import tqdm
import csv
from signwriting_transcription.pose_to_signwriting.joeynmt_pose.tokenizer import SwuTokenizer
from signwriting_transcription.pose_to_signwriting.data.config import create_test_config
from signwriting_transcription.pose_to_signwriting.data.datasets_pose import (pose_to_matrix, frame2ms, fsw_cut,
                                                                              pose_ndarray_to_matrix)
from signwriting_transcription.pose_to_signwriting.data.pose_data_utils import build_pose_vocab
from signwriting_transcription.pose_to_signwriting.data.preprocessing import preprocess_single_file
from signwriting_transcription.pose_to_signwriting.joeynmt_pose.prediction import translate
from signwriting_evaluation.metrics.similarity import SignWritingSimilarityMetric

HUGGINGFACE_REPO_ID = "ohadlanger/signwriting_transcription"
PADDING_PACTOR = 0.25  # padding factor for tight strategy, 25% padding from both sides of the segment


def get_args():
    parser = argparse.ArgumentParser()
    parser.add_argument('--poses_path', required=True, type=str, help='path to input pose file')
    parser.add_argument('--model', type=str, default='bc2de71.ckpt', help='model to use')
    parser.add_argument('--data_path', required=True, type=str, help='path to csv file with data')
    parser.add_argument('--strategy', type=str, default='tight',
                        choices=['tight', 'wide'], help='segmentation strategy to use')
    return parser.parse_args()


def download_model(experiment_dir: Path, model_name: str):
    model_path = experiment_dir / model_name
    if not model_path.exists():
        # pylint: disable=import-outside-toplevel
        from huggingface_hub import hf_hub_download

        hf_hub_download(repo_id=HUGGINGFACE_REPO_ID, filename=model_name, repo_type='space', local_dir='experiment')
        full_path = str(Path('experiment').absolute())
        best_ckpt_path = f'{full_path}/best.ckpt'
        # remove symlink if exists
        if os.path.exists(best_ckpt_path):
            os.remove(best_ckpt_path)
        os.symlink(f'{full_path}/{model_name}', best_ckpt_path)

    vocab_path = experiment_dir / 'spm_bpe1182.vocab'
    if not vocab_path.exists():
        build_pose_vocab(vocab_path.absolute())

    config_path = experiment_dir / 'config.yaml'
    if not config_path.exists():
        create_test_config(str(experiment_dir), str(experiment_dir))
        exit(1)


def preprocessing_sign(preprocessed_pose: Pose, startPoint, endPoint, strategy: str, temp_dir: str, name):
    temp_path = Path(temp_dir)
    # get pose length in ms
    pose_length = frame2ms(len(preprocessed_pose.body.data), preprocessed_pose.body.fps)
    sign_annotations = [(startPoint, endPoint, 0)]
    start_point = 0
    for index, (sign_start, sign_end, _) in enumerate(sign_annotations):
        if index + 1 < len(sign_annotations):
            end_point = sign_annotations[index + 1][0]
        else:
            end_point = pose_length
        if strategy == 'wide':  # wide strategy - split the all pose between the segments
            end_point = (end_point + sign_start) // 2
            np_pose, frame_rate = pose_to_matrix(preprocessed_pose)
            np_pose = pose_ndarray_to_matrix(np_pose, start_point, frame_rate, end_point).filled(fill_value=0)
            start_point = end_point
        else:  # tight strategy - add padding(PADDING_PACTOR) to the tight segment
            # add padding to the segment by the distance between the segments
            np_pose, frame_rate = pose_to_matrix(preprocessed_pose)
            np_pose = (pose_ndarray_to_matrix(np_pose, sign_start - (sign_start - start_point) * PADDING_PACTOR,
                                              frame_rate, sign_end + (end_point - sign_end) * PADDING_PACTOR)
                       .filled(fill_value=0))
            start_point = sign_end
        pose_path = temp_path / f'{name}.npy'
        np.save(pose_path, np_pose)
        return pose_path


def main():
    args = get_args()

    experiment_dir = Path('experiment')
    experiment_dir.mkdir(exist_ok=True)

    print('Downloading model...')
    download_model(experiment_dir, args.model)
    temp_dir = "/Users/rotemzilberman/Documents/Bsc/final_Project/Sign-Language-Transcription/model/script_files/translation/temp"
    os.makedirs(temp_dir, exist_ok=True)
    output_data = []  # contain touple of (namefile, hyp)
    names = []
    expected_target = []
    splits = []
    similarity_metric = SignWritingSimilarityMetric()
    print('Preprocessing data...')
    with open(f'{args.data_path}', 'r', encoding='utf-8-sig') as csvfile:
        reader = csv.DictReader(csvfile)
        for line in tqdm(reader):
            try:
                pose_path = Path(f"{args.poses_path}/{line['pose']}")
                startPoint = int(line['start'])
                endPoint = int(line['end'])
                preprocessed_pose = preprocess_single_file(pose_path, normalization=False)
                name = line['pose'].split('.')[0]
                temp_file = preprocessing_sign(preprocessed_pose, startPoint, endPoint, args.strategy, temp_dir, name)
                output_data.append(temp_file)
                names.append(name)
                expected_target.append(fsw_cut(swu2fsw(line['text'])))
                splits.append(line['split'])
            except Exception as e:
                continue
    print('Predicting signs...')
    hyp_list = translate('experiment/config.yaml', output_data)
    for index, hyp in enumerate(hyp_list):
        output_data[index] = (
        names[index], hyp, expected_target[index], similarity_metric.score_all([hyp], [expected_target[index]])[0][0],
        splits[index])
    output_data = sorted(output_data, key=lambda x: x[3], reverse=True)
    print('Saving data...')
    newdata_file = temp_dir + "/data.csv"
    with open(newdata_file, 'w', newline='', encoding='utf-8') as segment_file:
        writer = csv.writer(segment_file)
        writer.writerow(['name', 'hyp', 'expected_target', 'similarity', 'split'])
        for line in output_data:
            writer.writerow(list(line))
    print('Done Successfully...')


if __name__ == '__main__':
    main()
