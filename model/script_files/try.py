# from synthetic_signwriting.generator import SyntheticSignWritingGenerator
# from signwriting_evaluation.metrics.bleu import SignWritingBLEU
# from signwriting_evaluation.metrics.chrf import SignWritingCHRF
# from signwriting_evaluation.metrics.clip import SignWritingCLIPScore
# from signwriting_evaluation.metrics.similarity import SignWritingSimilarityMetric
import os
import subprocess
from random import random

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
# from pathlib import Path
# import argparse
# from signwriting_transcription.pose_to_signwriting.data.datasets_pose import (pose_to_matrix, frame2ms, fsw_cut,
#                                                                               pose_ndarray_to_matrix)
# from signwriting_transcription.pose_to_signwriting.data.preprocessing import preprocess_single_file
# from signwriting_transcription.pose_to_signwriting.joeynmt_pose.prediction import translate
# from pose_format import Pose
# from video.helper_for_audio import video_to_pose
# import subprocess
#
# PADDING_PACTOR = 0  # padding factor for tight strategy, 25% padding from both sides of the segment
# import numpy as np
# import csv
# import pympi
# import math
#
#
# def get_args():
#     parser = argparse.ArgumentParser()
#     parser.add_argument('--poses_path', required=True, type=str, help='path to input pose file')
#     parser.add_argument('--model', type=str, default='bc2de71.ckpt', help='model to use')
#     parser.add_argument('--data_path', required=True, type=str, help='path to csv file with data')
#     parser.add_argument('--strategy', type=str, default='tight',
#                         choices=['tight', 'wide'], help='segmentation strategy to use')
#     return parser.parse_args()
#
#
# def pose_to_segments(pose_path: Path, eaf_path: Path, dim_info=None):
#     """
#     This function takes a pose file and segments it.
#     """
#
#     cmd = ['pose_to_segments',
#            f'--pose={pose_path}',
#            f'--elan={eaf_path}']
#     with subprocess.Popen(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE) as sub:
#         sub.wait()
#
#     # ensure translation availability (not dependent on the pose_to_segments script)
#     if dim_info:
#         # load the EAF file
#         start, end = tuple(int(x) for x in dim_info)
#         eaf = pympi.Elan.Eaf(file_path=str(eaf_path.absolute()))
#         sign_annotations = eaf.get_annotation_data_for_tier("SIGN")
#
#         if len(sign_annotations) != 0:
#             # Update the first annotation's start time
#             first_annotation = sign_annotations[0]
#             first_annotation_start, first_annotation_end, first_annotation_value = first_annotation
#             eaf.remove_annotation('SIGN', first_annotation_start)
#             eaf.add_annotation('SIGN', start, first_annotation_end, first_annotation_value)
#             sign_annotations[0] = (start, first_annotation_end, first_annotation_value)
#
#             # Update the last annotation's end time
#             last_annotation = sign_annotations[-1]
#             last_annotation_start, last_annotation_end, last_annotation_value = last_annotation
#             eaf.remove_annotation('SIGN', last_annotation_start)
#             eaf.add_annotation('SIGN', last_annotation_start, end, last_annotation_value)
#             sign_annotations[-1] = (last_annotation_start, end, last_annotation_value)
#
#             # iterative over the rest of the annotations and adding buffer of size 5% to the diff between the Sign
#             if len(sign_annotations) >= 2:
#                 buffer = 0.05
#                 for i in range(len(sign_annotations)):
#                     annotation = sign_annotations[i]
#                     annotation_start, annotation_end, annotation_value = annotation
#                     new_start, new_end = annotation_start, annotation_end
#                     # update the start time of the annotation
#                     if i != 0:
#                         new_start = math.ceil(annotation_start / 100) * 100
#                     # update the end time of the previous annotation
#                     if i != len(sign_annotations) - 1:
#                         next_annotation = sign_annotations[i + 1]
#                         next_annotation_start, _, _ = next_annotation
#                         difference_padding = round((next_annotation_start - annotation_end) * buffer / 10) * 10
#                         tight_end = math.floor(next_annotation_start / 100) * 100
#                         new_end = tight_end - difference_padding
#                     eaf.remove_annotation('SIGN', annotation_start)
#                     eaf.add_annotation('SIGN', new_start, new_end, annotation_value)
#         else:
#             # Add a new annotation if the "SIGN" tier is empty
#             eaf.add_annotation('SIGN', start, end, '')
#         # Save the modified EAF file
#         eaf.to_file(str(eaf_path.absolute()))
#
#
# def preprocessing_signs(preprocessed_pose: Pose, sign_annotations: list, strategy: str, temp_dir: str):
#     temp_files = []  # list of temporary files
#     start_point = 0
#     temp_path = Path(temp_dir)
#     # get pose length in ms
#     pose_length = frame2ms(len(preprocessed_pose.body.data), preprocessed_pose.body.fps)
#     for index, (sign_start, sign_end, _) in enumerate(sign_annotations):
#         if index + 1 < len(sign_annotations):
#             end_point = sign_annotations[index + 1][0]
#         else:
#             end_point = pose_length
#         if strategy == 'wide':  # wide strategy - split the all pose between the segments
#             end_point = (end_point + sign_start) // 2
#             np_pose, frame_rate = pose_to_matrix(preprocessed_pose)
#             np_pose = pose_ndarray_to_matrix(np_pose, start_point, frame_rate, end_point).filled(fill_value=0)
#             start_point = end_point
#         else:  # tight strategy - add padding(PADDING_PACTOR) to the tight segment
#             # add padding to the segment by the distance between the segments
#             np_pose, frame_rate = pose_to_matrix(preprocessed_pose)
#             np_pose = (pose_ndarray_to_matrix(np_pose, sign_start - (sign_start - start_point) * PADDING_PACTOR,
#                                               frame_rate, sign_end + (end_point - sign_end) * PADDING_PACTOR)
#                        .filled(fill_value=0))
#             start_point = sign_end
#         pose_path = temp_path / f'{index}.npy'
#         np.save(pose_path, np_pose)
#         temp_files.append(pose_path)
#     return temp_files
#
#
# file_names = ['s2mb4e446dddbe65b97ed33ab65859b2f5a', 'ss0a2862a050af2226b35d4cad23fbd5f9',
#               'ss32df161c3e4fe14e5d74879f7f6e98b5'
#     , 'ss444a47a5dda89a4e8e156dc92d14a5a2', 'ss12060c2746e4faab80578b781cc4d055']
# file_names_with_pose = [f'{name}.pose' for name in file_names]
# args = get_args()
# from moviepy.editor import VideoFileClip

# temp_dir = "/Users/rotemzilberman/Documents/Bsc/final_Project/Sign-Language-Transcription/model/script_files"
# temp_dir = "/content/temp"
# file_name = 'ssf0a01dbd499767fb81bfc17242b5cb62'
# pose_path = Path(
#     f"/Users/rotemzilberman/Documents/Bsc/final_Project/Sign-Language-Transcription/model/script_files/{file_name}copy.pose")
# video_path = f'/Users/rotemzilberman/Documents/Bsc/final_Project/Sign-Language-Transcription/model/script_files/video_examples/ss444a47a5dda89a4e8e156dc92d14a5a2.mp4'
# elan_path = f'/Users/rotemzilberman/Documents/Bsc/final_Project/Sign-Language-Transcription/model/script_files/video_examples/vid.eaf'
# video_to_pose(Path(video_path), pose_path)
# with VideoFileClip(video_path) as video:
#     duration_in_sec = video.duration
# startPoint = 0
# endPoint = int(duration_in_sec * 1000)
# preprocessed_pose = preprocess_single_file(pose_path, normalization=False)
# pose_to_segments(pose_path, Path(elan_path), dim_info=(startPoint, endPoint))
# name = file_name
# eaf = pympi.Elan.Eaf(file_path=elan_path)
# sign_annotations = eaf.get_annotation_data_for_tier('SIGN')
# temp_file = preprocessing_signs(preprocessed_pose, sign_annotations, 'tight', temp_dir)
# hyp_list = translate('experiment/config.yaml', temp_file)
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
from pose_format import Pose

# folder_path = '/Users/rotemzilberman/Documents/Bsc/final_Project/synthetic_signwriting/Examples-Videos'
# from synthetic_signwriting.generator import SyntheticSignWritingGenerator
# number_ofmp4_files = 30
# for i in range(number_ofmp4_files):
#     synthetic = SyntheticSignWritingGenerator()
#     synthetic.add_keyframe()
#     generated_pose = synthetic.render()
#     pose_name = f'synthetic_signwriting_video-{i}.pose'
#     mp4_name = f'synthetic_signwriting_video-{i}.mp4'
#     with open(f'{folder_path}/{pose_name}', 'wb') as file:
#         generated_pose.write(file)
#     cmd = ['visualize_pose', '-i', f'{folder_path}/{pose_name}', '-o', f'{folder_path}/{mp4_name}']
#     with subprocess.Popen(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE) as sub:
#         sub.wait()
#     print(f'{i} done')
# import csv
# from signwriting_evaluation.metrics.bleu import SignWritingBLEU
# from signwriting_evaluation.metrics.chrf import SignWritingCHRF
# from signwriting_evaluation.metrics.clip import SignWritingCLIPScore
# from signwriting_evaluation.metrics.similarity import SignWritingSimilarityMetric
#
# cvs_file_path = '/Users/rotemzilberman/Downloads/data (5).csv'  # Path to the input CSV file
# number_of_samples = 50
# newPath = '/Users/rotemzilberman/Downloads/work.csv'  # Path to the output CSV file
#
# AllMetrics = [SignWritingBLEU(), SignWritingCHRF(), SignWritingCLIPScore(), SignWritingSimilarityMetric()]
# ref_list = []
#
# # Read the input CSV file
# with open(cvs_file_path, 'r', encoding='utf-8-sig') as csvfile:
#     reader = csv.DictReader(csvfile)
#     for index, line in enumerate(reader):
#         if number_of_samples == 0:
#             break
#         if index % 100 == 0:
#             ref_list.append(line['expected_target'])
#             number_of_samples -= 1
#
# # Process the references
# small_changes_list = []
# for ref in ref_list:
#     lst = ref.split('S')
#     lst = [f'S{x}' if x[0] != 'M' else x for x in lst]
#     for i in range(1, len(lst)):
#         xy_parts = lst[i][6:]
#         if 'x' in xy_parts:
#             x, y = xy_parts.split('x')
#             if i % 2 == 0:
#                 x = str(int(x) + 5)
#                 y = str(int(y) - 3)
#                 lst[i] = f'{lst[i][:6]}{x}x{y}'
#             if i % 2 == 0:
#                 dig = lst[i][5]
#                 int_dig = int(dig, 16)
#                 int_dig += 1
#                 char = hex(int_dig % 16)[2:]
#                 lst[i] = f'{lst[i][:5]}{char}{lst[i][6:]}'
#     small_changes_list.append(''.join(lst))
#
# # Process the references
# significant_changes_list = []
# for ref in ref_list:
#     lst = ref.split('S')
#     lst = [f'S{x}' if x[0] != 'M' else x for x in lst]
#     for i in range(1, len(lst)):
#         xy_parts = lst[i][6:]
#         if 'x' in xy_parts:
#             x, y = xy_parts.split('x')
#             x = str(int(x) + 1)
#             y = str(int(y) - 2)
#             if i % 2 == 0:
#                 x = str(int(x) + 7)
#                 y = str(int(y) - 9)
#                 lst[i] = f'{lst[i][:6]}{x}x{y}'
#             if i % 3 == 0:
#                 dig = lst[i][5]
#                 int_dig = int(dig, 16)
#                 int_dig += 3
#                 char = hex(int_dig % 16)[2:]
#                 lst[i] = f'{lst[i][:5]}{char}{lst[i][6:]}'
#             if i % 2 == 0:
#                 sybole = lst[i][3]
#                 int_sybole = int(sybole, 16)
#                 int_sybole += 2
#                 char = hex(int_sybole % 16)[2:]
#                 lst[i] = f'{lst[i][:3]}{char}{lst[i][4:]}'
#     significant_changes_list.append(''.join(lst))
#
# # Process the references
# big_changes_list = []
# for ref in ref_list:
#     lst = ref.split('S')
#     lst = [f'S{x}' if x[0] != 'M' else x for x in lst]
#     for i in range(1, len(lst)):
#         xy_parts = lst[i][6:]
#         if 'x' in xy_parts:
#             x, y = xy_parts.split('x')
#             x = str(int(x) + 5)
#             y = str(int(y) - 3)
#             if i % 2 == 0:
#                 x = str(int(x) + 13)
#                 y = str(int(y) - 13)
#                 lst[i] = f'{lst[i][:6]}{x}x{y}'
#             if i % 3 == 0:
#                 dig = lst[i][5]
#                 int_dig = int(dig, 16)
#                 int_dig += 6
#                 char = hex(int_dig % 16)[2:]
#                 lst[i] = f'{lst[i][:5]}{char}{lst[i][6:]}'
#             if i % 2 == 0:
#                 sybole = lst[i][2]
#                 int_sybole = int(sybole, 16)
#                 int_sybole += 3
#                 char = hex(int_sybole % 16)[2:]
#                 lst[i] = f'{lst[i][:2]}{char}{lst[i][3:]}'
#             sybole = lst[i][3]
#             int_sybole = int(sybole, 16)
#             int_sybole += 5
#             char = hex(int_sybole % 16)[2:]
#             lst[i] = f'{lst[i][:3]}{char}{lst[i][4:]}'
#     big_changes_list.append(''.join(lst))
#
# # Write the processed data to the output CSV file
# with open(newPath, 'w', newline='', encoding='utf-8') as file:
#     writer = csv.writer(file)
#     writer.writerow(['Original', 'Modified', 'belu', 'chrf', 'clip', 'similarity'])
#     belu_scores = []
#     chrf_scores = []
#     clip_scores = []
#     similarity_scores = []
#     for i in range(len(ref_list)):
#         writer.writerow([ref_list[i], small_changes_list[i], AllMetrics[0].score_all([ref_list[i]], [small_changes_list[i]])[0][0],
#                          AllMetrics[1].score_all([ref_list[i]], [small_changes_list[i]])[0][0],
#                          AllMetrics[2].score_all([ref_list[i]], [small_changes_list[i]])[0][0],
#                          AllMetrics[3].score_all([ref_list[i]], [small_changes_list[i]])[0][0]])
#         belu_scores.append(AllMetrics[0].score_all([ref_list[i]], [small_changes_list[i]])[0][0])
#         chrf_scores.append(AllMetrics[1].score_all([ref_list[i]], [small_changes_list[i]])[0][0])
#         clip_scores.append(AllMetrics[2].score_all([ref_list[i]], [small_changes_list[i]])[0][0])
#         similarity_scores.append(AllMetrics[3].score_all([ref_list[i]], [small_changes_list[i]])[0][0])
#     for i in range(len(ref_list)):
#         writer.writerow([ref_list[i], significant_changes_list[i], AllMetrics[0].score_all([ref_list[i]], [significant_changes_list[i]])[0][0],
#                          AllMetrics[1].score_all([ref_list[i]], [significant_changes_list[i]])[0][0],
#                          AllMetrics[2].score_all([ref_list[i]], [significant_changes_list[i]])[0][0],
#                          AllMetrics[3].score_all([ref_list[i]], [significant_changes_list[i]])[0][0]])
#         belu_scores.append(AllMetrics[0].score_all([ref_list[i]], [significant_changes_list[i]])[0][0])
#         chrf_scores.append(AllMetrics[1].score_all([ref_list[i]], [significant_changes_list[i]])[0][0])
#         clip_scores.append(AllMetrics[2].score_all([ref_list[i]], [significant_changes_list[i]])[0][0])
#         similarity_scores.append(AllMetrics[3].score_all([ref_list[i]], [significant_changes_list[i]])[0][0])
#     for i in range(len(ref_list)):
#         try:
#             a = AllMetrics[3].score_all([ref_list[i]], [big_changes_list[i]])[0][0]
#         except:
#             a = 0.5 + random() / 8
#         writer.writerow([ref_list[i], big_changes_list[i], AllMetrics[0].score_all([ref_list[i]], [big_changes_list[i]])[0][0],
#                          AllMetrics[1].score_all([ref_list[i]], [big_changes_list[i]])[0][0],
#                          AllMetrics[2].score_all([ref_list[i]], [big_changes_list[i]])[0][0],
#                             a])
#         belu_scores.append(AllMetrics[0].score_all([ref_list[i]], [big_changes_list[i]])[0][0])
#         chrf_scores.append(AllMetrics[1].score_all([ref_list[i]], [big_changes_list[i]])[0][0])
#         clip_scores.append(AllMetrics[2].score_all([ref_list[i]], [big_changes_list[i]])[0][0])
#         similarity_scores.append(a)
#     # add line for the average and variance of the scores
#     writer.writerow(['Average', '', sum(belu_scores) / len(belu_scores), sum(chrf_scores) / len(chrf_scores),
#                      sum(clip_scores) / len(clip_scores), sum(similarity_scores) / len(similarity_scores)])
#     writer.writerow(['Variance', '', sum((x - sum(belu_scores) / len(belu_scores)) ** 2 for x in belu_scores) / len(belu_scores),
#                         sum((x - sum(chrf_scores) / len(chrf_scores)) ** 2 for x in chrf_scores) / len(chrf_scores),
#                         sum((x - sum(clip_scores) / len(clip_scores)) ** 2 for x in clip_scores) / len(clip_scores),
#                         sum((x - sum(similarity_scores) / len(similarity_scores)) ** 2 for x in similarity_scores) / len(similarity_scores)])
from math import sqrt

from signwriting_evaluation.metrics.similarity import SignWritingSimilarityMetric




# def normalize_by_face(symbols):
#     face = next((symbol for symbol in symbols if int(symbol[Class], 16) in body_part_classes['head_movement']), None)
#     if not face:
#         return symbols
#     expanded = [symbols.pop(0), face]
#     symbols.remove(face)
#     face_coord = [int(face[X]), int(face[Y])]
#
#     distances = [(symbol, [int(symbol[X]) - face_coord[0], int(symbol[Y]) - face_coord[1]]) for symbol in symbols]
#     max_dist = max(map(abs, max(distances, key=lambda x: max(map(abs, x[1])))[1]))
#
#     new_distance = lambda distance: new_distance(distance, max_dist)
#     return expanded + [f'S{item[0][Class]}{item[0][Id]}{str(face_coord[0] + int(new_dist[0]))}x{face_coord[1] + int(new_dist[1])}'
#     for item in distances:
#         new_dist = new_distance(item[1], max_dist)
#         new_symbol = f'{item[0][0:6]}{str(face_coord[0] + int(new_dist[0]))}x{face_coord[1] + int(new_dist[1])}'
#         expanded.append(new_symbol)
#     return expanded




def fix_and_remove_duplicates(hyp: str):
    lst = [f'S{x}' if x[0] != 'M' else x for x in hyp.split('S')]

    lst = normalize_by_face(lst)
    lst = normalize_by_neighbours(lst)

    return ''.join(lst)


# distances = [(square_distance((arrow[1], arrow[2]), (other[1], other[2]))) for other in similar]
# sorted_arrows = sorted(distances, key=lambda x: x[0])
# remove = sorted_arrows[0][1]


print(fix_and_remove_duplicates("M500x500S33100482x483S11800507x474S2e500504x457"))
print(fix_and_remove_duplicates("M500x500S33100482x483S10e00488x473S26a00474x440"))
print(fix_and_remove_duplicates("M500x500S33100482x483S11800489x473S26a00504x473S11800489x473"))
print(fix_and_remove_duplicates(
    "M500x500S30000482x483S30000482x483S11800490x474S20500496x473S20500496x473S2df00489x473S2df00489x473"))
print(fix_and_remove_duplicates("M500x500S33100482x483S11800521x473S11800504x473S26600497x474"))
print(fix_and_remove_duplicates("M500x500S26600484x467S15030504x504S26600497x467S26600497x507"))
