import argparse
import tempfile
from pathlib import Path

import pympi
from translation.helper_for_translate import (pose_to_signWriting, signWriting_to_text, text_to_speech,
                                              video_to_gender, extract_elan_translations)
from video.helper_for_audio import video_to_pose, pose_to_segments


def get_args():
    parser = argparse.ArgumentParser()
    parser.add_argument('--video_path', required=True)
    parser.add_argument('--signWriting_translation', default=None)
    parser.add_argument('--voice_translation', default=None)
    parser.add_argument('--text_translation', required=True)
    parser.add_argument('--output_path', required=True)
    parser.add_argument('--sign-writing-language', required=True)
    return parser.parse_args()


def main():
    args = get_args()
    # translate video to pose and then to signWriting
    with tempfile.TemporaryDirectory() as temp_dir:
        temp_pose_path = Path(temp_dir) / 'temp.pose'
        temp_elan_path = Path(temp_dir) / 'temp.eaf'
        output_path = Path(args.output_path)

        # prepare the video to be translated to pose
        info = video_to_pose(Path(args.video_path), temp_pose_path, dim_info=True)
        pose_to_segments(temp_pose_path, temp_elan_path, info)
        # copy the pose file to the output path
        # make translations
        pose_to_signWriting(temp_pose_path, temp_elan_path)
        text_translation = None

        # make signWriting translation
        if args.signWriting_translation is not None:
            extract_elan_translations(temp_elan_path, output_path)

        # make translations
        if args.text_translation:
            if args.signWriting_translation:
                text_path = output_path / 'signWriting_translation.txt'
            else:
                extract_elan_translations(temp_elan_path, Path(temp_dir))
                text_path = Path(temp_dir) / 'signWriting_translation.txt'

            text_translation = signWriting_to_text(text_path, temp_dir, args.sign_writing_language)
            with open(output_path / 'text_translation.txt', 'w') as file:
                file.write(" ".join(text_translation))

        # make voice translation
        if args.voice_translation is not None:
            if text_translation is None:
                text_translation = signWriting_to_text(temp_elan_path, Path(temp_dir), args.sign_writing_language)
            gender = video_to_gender(Path(args.video_path))
            text_to_speech(text_translation, output_path, 'voice_translation.mp3', gender)
        print('Done Successfully...')


if __name__ == '__main__':
    main()
