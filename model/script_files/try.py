from synthetic_signwriting.generator import SyntheticSignWritingGenerator
from signwriting_evaluation.metrics.bleu import SignWritingBLEU
from signwriting_evaluation.metrics.chrf import SignWritingCHRF
from signwriting_evaluation.metrics.clip import SignWritingCLIPScore
from signwriting_evaluation.metrics.similarity import SignWritingSimilarityMetric

# # create synthetic data
# synthetic = SyntheticSignWritingGenerator()
# synthetic.add_keyframe()
# generated_pose1 = synthetic.render_fsw()
#
# synthetic = SyntheticSignWritingGenerator()
# synthetic.add_keyframe()
# generated_pose2 = synthetic.render_fsw()
#
# synthetic = SyntheticSignWritingGenerator()
# synthetic.add_keyframe()
# generated_pose3 = synthetic.render_fsw()
#
# print(generated_pose1)
# print(generated_pose2)
# print(generated_pose3)

# AllMetrics = [SignWritingBLEU(), SignWritingCHRF(), SignWritingCLIPScore(), SignWritingSimilarityMetric()]
# with open("FSW_score_compere.txt", 'r') as f:
#     for index, line in enumerate(f):
#         hyp, ref = line.split(' : ')
#         for metric in AllMetrics:
#             print(f"for{index}- {metric.name}: {metric.score_all([hyp], [ref])}")
# from pose_format import Pose
# from pose_format.utils.generic import reduce_holistic
# from sign_vq.data.normalize import pre_process_mediapipe, normalize_mean_std
#
# with open(
#         '/translation/pose_files/s2m000257553265e936ce58035b3cd6124b.pose',
#         'rb') as pose_file:
#     pose = Pose.read(pose_file.read())
#     pose = normalize_mean_std(pose)
#
# with open(
#         '/Users/rotemzilberman/Documents/Bsc/final_Project/Sign-Language-Transcription/model/script_files/translation/pose2.pose',
#         'wb') as pose_file:
#     Pose.write(pose, pose_file)
# import csv
#
# fsw = 'M500x500S15330504x504S15330479x504S26600504x467S26600503x484\
#     M500x500S33100482x483S11800507x473S20600473x474\
#     M500x500S36d00479x477S15004503x497S1500c479x507S26604497x507\
#     M500x500S30007482x483S1ed37513x478S26507520x450\
#     M500x500S33100482x483S11800504x483S26600504x474\
#     M500x500S33100482x483S11800507x473S20600466x474\
#     M500x500S30000482x483S30004482x483S11800489x463S20500498x472S26600520x450\
#     M500x500S33100482x483S11800507x473S26a00504x440'
# fsw = fsw.split('    ')
# file = '/Users/rotemzilberman/Downloads/data (2).csv'
# poses_names = []
# with open(file, 'r', encoding='utf-8-sig') as csvfile:
#     reader = csv.DictReader(csvfile)
#     # search for the pose name
#     for line in reader:
#         if line['hyp'] in fsw:
#             poses_names.append(line['name'])
#             fsw.remove(line['hyp'])
# for index, name in enumerate(poses_names):
#     poses_names[index] = f"{name}.pose"
# file = '/Users/rotemzilberman/Downloads/data (6).csv'
# pose_details = []
# with open(file, 'r', encoding='utf-8-sig') as csvfile:
#     reader = csv.DictReader(csvfile)
#     for line in reader:
#         if line['pose'] in poses_names:
#             pose_details.append(line)
# output = '/Users/rotemzilberman/Documents/Bsc/final_Project/Sign-Language-Transcription/model/script_files/try.txt'
# with open(output, 'w') as file:
#     for line in pose_details:
#         file.write(line['pose'] + ' ' + line['start'] + ' ' + line['end'])
#         file.write('\n')
from pathlib import Path
import argparse
from signwriting_transcription.pose_to_signwriting.data.datasets_pose import (pose_to_matrix, frame2ms, fsw_cut,
                                                                              pose_ndarray_to_matrix)
from signwriting_transcription.pose_to_signwriting.data.preprocessing import preprocess_single_file
from signwriting_transcription.pose_to_signwriting.joeynmt_pose.prediction import translate
from pose_format import Pose
from video.helper_for_audio import video_to_pose

PADDING_PACTOR = 0.25  # padding factor for tight strategy, 25% padding from both sides of the segment
import numpy as np
import csv


def get_args():
    parser = argparse.ArgumentParser()
    parser.add_argument('--poses_path', required=True, type=str, help='path to input pose file')
    parser.add_argument('--model', type=str, default='bc2de71.ckpt', help='model to use')
    parser.add_argument('--data_path', required=True, type=str, help='path to csv file with data')
    parser.add_argument('--strategy', type=str, default='tight',
                        choices=['tight', 'wide'], help='segmentation strategy to use')
    return parser.parse_args()


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


# file_names = ['s2mb4e446dddbe65b97ed33ab65859b2f5a', 'ss0a2862a050af2226b35d4cad23fbd5f9',
#               'ss32df161c3e4fe14e5d74879f7f6e98b5'
#     ,'ss444a47a5dda89a4e8e156dc92d14a5a2', 'ss12060c2746e4faab80578b781cc4d055']
# file_names_with_pose = [f'{name}.pose' for name in file_names]
# args = get_args()
# from moviepy.editor import VideoFileClip
# temp_dir = "/Users/rotemzilberman/Documents/Bsc/final_Project/Sign-Language-Transcription/model/script_files/cutted_video"
# # temp_dir = "/content/temp"
# file_name = 'ssf0a01dbd499767fb81bfc17242b5cb62'
# pose_path = Path(
#     f"/Users/rotemzilberman/Documents/Bsc/final_Project/Sign-Language-Transcription/model/script_files/cutted_video/{file_name}copy.pose")
# video_path = f'/Users/rotemzilberman/Documents/Bsc/final_Project/Sign-Language-Transcription/model/script_files/video_examples/{file_name}.mp4'
# video_to_pose(Path(video_path), pose_path)
# with VideoFileClip(video_path) as video:
#     duration_in_sec = video.duration
# startPoint = 0
# endPoint = int(duration_in_sec * 1000)
# preprocessed_pose = preprocess_single_file(pose_path, normalization=False)
# name = file_name
# temp_file = preprocessing_sign(preprocessed_pose, startPoint, endPoint, 'tight', temp_dir, name)
# output_data = [temp_file]
# hyp_list = translate('experiment/config.yaml', output_data)
# print(hyp_list)
# path = '/content/signwriting-transcription/transcription_data_set'
# output_data = []
# for file_name in file_names_with_pose:
#     with open(f'{args.data_path}', 'r', encoding='utf-8-sig') as csvfile:
#         reader = csv.DictReader(csvfile)
#         for line in reader:
#             if line['pose'] == file_name:
#                 pose_path = Path(f"{args.poses_path}/{line['pose']}")
#                 startPoint = int(line['start'])
#                 endPoint = int(line['end'])
#                 preprocessed_pose = preprocess_single_file(pose_path, normalization=False)
#                 name = line['pose'].split('.')[0]
#                 temp_file = preprocessing_sign(preprocessed_pose, startPoint, endPoint, args.strategy, temp_dir, name)
#                 output_data.append(temp_file)
# hyp_list = translate('experiment/config.yaml', output_data)
# print(hyp_list)
#
# second_output_data = []
# second_translated_data = []
# for a in output_data:
#     second_output_data.append(a)
#     hyp_list = translate('experiment/config.yaml', second_output_data)
#     second_translated_data.append(hyp_list[0])
#     second_output_data = []
# print(second_translated_data)


