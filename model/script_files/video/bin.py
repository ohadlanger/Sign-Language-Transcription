import argparse
import tempfile
from pathlib import Path
import shutil
from moviepy.editor import AudioFileClip, VideoFileClip

from video.helper_for_audio import cut_audio, video_to_segment, adding_subtitles, pose_to_video


def get_args():
    parser = argparse.ArgumentParser()
    parser.add_argument('--video_path', required=True)
    parser.add_argument('--audio_path', default=None)
    parser.add_argument('--subtitles_path', default=None)
    parser.add_argument('--output_path', required=True)
    return parser.parse_args()


def combine_video_audio(video_path: Path, audio_path: Path, segments: list | tuple):
    # get the segments of the video
    if isinstance(segments, list):
        segments = (segments[0][0], segments[-1][1])

    # combine the video and audio files
    video = VideoFileClip(str(video_path.absolute()))
    audio = AudioFileClip(str(audio_path.absolute()))
    final_video = video.set_audio(cut_audio(audio, segments[0], segments[1]))
    return final_video


def main():
    args = get_args()
    video_file = None
    video_path = Path(args.video_path)
    audio_path = Path(args.audio_path)
    output_path = Path(args.output_path)

    with tempfile.TemporaryDirectory() as temp_dir:
        temp_pose_path = Path(temp_dir) / 'temp.pose'
        temp_pose_video_path = Path(temp_dir) / 'temp_video.mp4'
        segments = video_to_segment(video_path, args.subtitles_path, temp_pose_path)
        pose_to_video(temp_pose_path, temp_pose_video_path)

        # save it in the output path
        shutil.copy2(temp_pose_video_path, output_path / 'pose_video.mp4')

    if args.audio_path is not None:
        video_file = combine_video_audio(video_path, audio_path, segments)
    if args.subtitles_path is not None:
        if video_file is None:
            video_file = VideoFileClip(video_path)
        video_file = adding_subtitles(video_file, args.subtitles_path, segments)

    if video_file is not None:
        video_file.write_videofile(str(output_path / 'final_video.mp4'), codec='libx264', audio_codec='aac')
    
    print('Done Successfully...')


if __name__ == '__main__':
    main()
