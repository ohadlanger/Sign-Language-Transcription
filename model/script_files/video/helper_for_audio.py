import datetime
import os
import subprocess
from pathlib import Path
import tempfile

import pympi
from moviepy.audio.AudioClip import AudioClip, concatenate_audioclips
from moviepy.editor import AudioFileClip, VideoFileClip, TextClip
from moviepy.video.compositing.CompositeVideoClip import CompositeVideoClip
from moviepy.video.fx.speedx import speedx
from moviepy.video.tools.subtitles import SubtitlesClip


def video_to_pose(video_path: Path, output_path: Path):
    """
    This function takes a video file and returns a pose file.
    """
    cmd = [
        'video_to_pose',
        '--format', 'mediapipe',
        '-i', str(video_path.absolute()),
        '-o', str(output_path.absolute())
    ]
    with subprocess.Popen(cmd,
                          stdout=subprocess.PIPE, stderr=subprocess.PIPE) as sub:
        sub.wait()


def pose_to_segments(pose_path: Path, eaf_path: Path):
    """
    This function takes a pose file and segments it.
    """

    cmd = ['pose_to_segments',
           f'--pose={pose_path}',
           f'--elan={eaf_path}']
    with subprocess.Popen(cmd,
                          stdout=subprocess.PIPE, stderr=subprocess.PIPE) as sub:
        sub.wait()


def video_to_segment(video_path: Path, optional_eaf_path: str = None):
    """
    This function takes a video file and returns a list of segments where each segment is a tuple of start and end
    time in milliseconds.
    """
    if optional_eaf_path and optional_eaf_path.endswith('.eaf'):
        eaf = pympi.Elan.Eaf(file_path=optional_eaf_path)
        sign_annotations = eaf.get_annotation_data_for_tier("SIGN")
        lst = []
        for sign in sign_annotations:
            lst.append((sign[0], sign[1], sign[2]))
        return lst

    with tempfile.TemporaryDirectory() as temp_dir:
        # process the video file to pose file
        temp_path = Path(temp_dir) / 'temp.pose'
        video_to_pose(video_path, temp_path)
        pose = temp_path

        # process the pose file to segments
        eaf_path = Path(temp_dir) / 'temp.eaf'
        pose_to_segments(pose, eaf_path)
        eaf = pympi.Elan.Eaf(file_path=eaf_path)

        # Accessing annotations from the "SIGN" tier
        sign_annotations = eaf.get_annotation_data_for_tier("SIGN")

        # get the segments amd add them to the list
        if len(sign_annotations) != 0:
            segment = (sign_annotations[0][0], sign_annotations[len(sign_annotations) - 1][1])
        else:
            segment = (0, None)

    return segment


def cut_audio(audio: AudioFileClip, start: int, end: int):
    """
    This function takes an audio file and modifies it to start from the start time and end at the end time.
    """
    start_s = start / 1000
    end_s = end / 1000
    speed_factor = audio.duration / (end_s - start_s)
    speed_factor = min(0.85, max(1.15, speed_factor))
    audio = speedx(audio, factor=speed_factor)
    # Create a one-second silence audio clip
    silence_duration = 1  # in seconds
    silence = AudioClip(lambda t: 0, duration=silence_duration)
    audio = concatenate_audioclips([silence, audio])
    audio.write_audiofile('temp.mp3')
    audio = AudioFileClip('temp.mp3')
    os.remove('temp.mp3')
    return audio


def ms_to_srt_format(milliseconds):
    seconds = milliseconds / 1000.0

    time_delta = datetime.timedelta(seconds=seconds)

    hours, remainder = divmod(time_delta.seconds, 3600)
    minutes, seconds = divmod(remainder, 60)
    milliseconds = time_delta.microseconds // 1000

    return f"{hours:02}:{minutes:02}:{seconds:02},{milliseconds:03}"


def adding_subtitles(video: VideoFileClip, subtitles_path: str, segments: tuple | list):
    """
    This function takes a video file, a subtitle file, and an output path and adds the subtitles to the video.
    """
    with tempfile.TemporaryDirectory() as temp_dir:
        temp_name = hash(video)
        subtitle_path = Path(temp_dir) / f'{temp_name}.srt'
        if isinstance(segments, tuple):
            with open(subtitles_path, 'r') as f:
                subtitles = " ".join([line for line in f])
            subtitles = [(segments[0], segments[1], subtitles)]
        else:
            subtitles = segments
        for index, (start, end, subtitle) in enumerate(subtitles):
            # generate the subtitle text in the srt format
            subtitle = f'{index + 1}\n{ms_to_srt_format(start)} --> {ms_to_srt_format(end)}\n{subtitle}\n\n'
            with open(subtitle_path, 'w') as f:
                f.write(subtitle)

        # add the subtitles to the video
        generator = lambda txt: TextClip(txt, font='Arial', fontsize=24, color='white', bg_color='black')
        subs = SubtitlesClip(str(subtitle_path.absolute()), generator)
        video = CompositeVideoClip([video, subs.set_position(('center', 'bottom'))])
    return video
