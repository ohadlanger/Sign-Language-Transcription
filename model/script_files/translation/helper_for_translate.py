import random

from gtts import gTTS
import os
import pyttsx3
import cv2
from keras.models import load_model
import numpy as np
from PIL import Image
from moviepy.editor import VideoFileClip
from joeynmt.constants import BOS_TOKEN, EOS_TOKEN, PAD_TOKEN, UNK_TOKEN
from signwriting.tokenizer.signwriting_tokenizer import SignWritingTokenizer
import subprocess
import pympi
import json
import openai
import socket
from signwriting_evaluation.metrics.similarity import SignWritingSimilarityMetric


def sockeye_translate_activate_communication(input_file, output_file):
    connection = None
    ip = '192.168.1.102'
    port = 12345
    with open(input_file, 'rb') as file:
        all_data = file.read()
    if all_data != b"":  # If data was read from file
        try:
            connection = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            connection.connect((ip, port))
            connection.sendall(all_data)
            connection.shutdown(socket.SHUT_WR)
            print("Data sent to bridge")

            response = b""
            while True:
                data = connection.recv(1024)
                if not data:
                    break
                response += data
            if response != b"":
                with open(output_file, 'wb') as file:
                    file.write(response)
                print("Response received and saved to file")
            else:
                print("No data received from bridge.")
        finally:
            if connection is not None:
                connection.close()


def modify_phrase(predictions_list):
    # Set the prompt
    static_text = ("Create a grammatically correct sentence by selecting exactly one word from each set, ensuring that "
                   "no two words from the same set belong to the same category, don't add new word. Use all sets:")
    prompt = " ".join([f'set {inx + 1}:{"/".join(p.split("/")[:2])}' for inx, p in enumerate(predictions_list)])
    full_prompt = f"{static_text} {prompt} (return just the sentence)"

    # Model parameters
    openai.api_key = ('sk-proj-7PV5QEfZyj5FojEBdtYnHwzaHZhq4DgB2Tzn1fsVVXUurTyLBlS4JrLLTXT3BlbkFJJbQ3OPAeER0pM3CBdqrXE'
                      '6f8ubs_hUeHtIOGkqH9dPzm5W2zJtWAfdTMsA')  # Set your OpenAI API key
    model = "GPT-4o-mini"  # Model name
    temperature = 0.7  # Randomness in the response. 0.7 is a good balance.
    max_tokens = 20  # Maximum number of tokens to generate in the response.

    try:
        # Create a chat completion
        response = openai.ChatCompletion.create(
            model=model,
            messages=[{"role": "user", "content": full_prompt}],
            temperature=temperature,
            max_tokens=max_tokens
        )
        return response['choices'][0]['message']['content'].strip()
    except Exception as _:
        return "this is sing language translation service"


def signWriting_to_text(signWriting_path, working_dir, Video_language):
    predictions = []
    kwargs = {'init_token': BOS_TOKEN,
              'eos_token': EOS_TOKEN,
              'pad_token': PAD_TOKEN,
              'unk_token': UNK_TOKEN}
    sign_language_mapping = {
        'en': 'ase',  # English -> American Sign Language (ASL)
        'fr': 'fcs',  # French -> French Sign Language (LSF or FCS)
        'it': 'ise',  # Italian -> Italian Sign Language (LIS)
        'sv': 'swl',  # Swedish -> Swedish Sign Language (SSL)
        'ca': 'csc',  # Catalan -> Catalan Sign Language (LSC or CSC)
        'es': 'mfs',  # Spanish -> Spanish Sign Language (LSE or MFS)
        'ms': 'xml',  # Malay -> Malaysian Sign Language (XML)
        'th': 'tsq',  # Thai -> Thai Sign Language (TSQ)
        'gr': 'gss',  # Greek -> Greek Sign Language (GSS)
        'de': 'gsg',  # German -> German Sign Language (GSG or DGS)
        'fr-CH': 'ssr',  # Swiss-French -> Swiss-French Sign Language (SSR)
        'de-CH': 'sgg',  # Swiss-German -> Swiss-German Sign Language (DSGS or SGG)
        'en-NG': 'nsi',  # Nigerian -> Nigerian Sign Language (NSI)
        'fr-BE': 'sfb'  # French-Belgian -> Belgian-French Sign Language (SFB)
    }
    return "this is sing language translation service"
    sign_writing_language = sign_language_mapping[Video_language] if Video_language in sign_language_mapping else 'ase'
    tokenizer = SignWritingTokenizer(starting_index=None, **kwargs)
    with open(signWriting_path, 'r') as file, open(f'{working_dir}/input_file.txt', 'w') as file2:
        for line in file:
            ase = [tokenizer.i2s[s] for s in tokenizer.tokenize(line)]
            aes = f'$en ${sign_writing_language} {" ".join(ase)}'
            file2.write(f'{aes}\n')

    # Translate the signWriting to text
    # cmd = ['python', '-m', 'sockeye.translate', '-m', './translation/model_file/sockeye-signwriting-to-text', '--input',
    #        f'{working_dir}/input_file.txt', '--output', f'{working_dir}/output_bpe.txt', '--nbest-size=3']
    # with subprocess.Popen(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE) as sub:
    #     stdout, stderr = sub.communicate()  # Capture the output and error
    # ask using the api, fetch 197.0.0.1:5000 (it used tcp) with the text that contain {working_dir}/input_file.txt
    # and the output will be {working_dir}/output_bpe.txt
    # ip = '197.0.0.1'
    # port = 5000
    # cmd = ['curl', '-X', 'POST', f'http://{ip}:{port}', '--data-binary', f'@{working_dir}/input_file.txt',
    #        '--output', f'{working_dir}/output_bpe.txt']
    # with subprocess.Popen(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE) as sub:
    #     sub.wait()

    # process the output
    input_file = f'{working_dir}/input_file.txt'
    output_bpe_file = f'{working_dir}/output_bpe.txt'
    output_file = f'{working_dir}/output.txt'
    try:
        sockeye_translate_activate_communication(input_file, output_bpe_file)
    except Exception as e:
        return "this is sing language translation service"

    cmd = ['sed', '-re', 's/(@@ |@@$)//g']

    with open(output_bpe_file, 'r') as infile, open(output_file, 'w') as outfile:
        with subprocess.Popen(cmd, stdin=infile, stdout=outfile, stderr=subprocess.PIPE) as sub:
            sub.wait()

    with open(output_file, 'r') as file:
        for line in file:
            if len(line.strip()) > 0:
                predictions.append("/".join(json.loads(line)["translations"]))

    phrase = modify_phrase(predictions)
    return phrase


def pose_to_signWriting(pose_path, elan_path, model='bc2de71.ckpt', strategy='wide'):
    """
    This function takes a pose file and translates it to signWriting.
    """
    pose_path = str(pose_path.absolute())
    cmd = ['pose_to_signwriting', f'--pose={pose_path}', f'--elan={elan_path}', f'--strategy={strategy}',
           f'--model={model}']
    with subprocess.Popen(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE) as sub:
        stdout, stderr = sub.communicate()  # Capture the output and error


def extract_elan_translations(elan_path, output_path):
    def fix_and_remove_duplicates(hyp: str):
        lst = hyp.split('S')
        lst = [f'S{x}' if x[0] != 'M' else x for x in lst]
        final_lst = []
        similarity_metric = SignWritingSimilarityMetric()
        body_part_classes = {'hands_shapes': range(0x100, 0x205),
                             'facial_expressions': range(0x30A, 0x36A),
                             'head_movement': range(0x2FF, 0x30A)}
        all_body_part_classes = set().union(*body_part_classes.values())

        for i in range(len(lst)):
            unique = True
            body_symbol_class = int(lst[i][1:4], 16)
            x, y = 0, 0
            if body_symbol_class not in all_body_part_classes and lst[i][0] != 'M':
                unique = False
                x, y = tuple(int(pos) for pos in lst[i][6:].split('x'))

            for j in range(len(final_lst)):
                if unique and similarity_metric.score_all([lst[i]], [final_lst[j]])[0][0] > 0.93:
                    unique = False
                    break
                if not unique:
                    sample_symbol_class = int(final_lst[j][1:4], 16)
                    if sample_symbol_class in all_body_part_classes or final_lst[j][0] == 'M':
                        continue
                    x2, y2 = tuple(int(pos) for pos in final_lst[j][6:].split('x'))
                    buffer = 10
                    if abs(x - x2) < buffer and abs(y - y2) < buffer:
                        x = x2 + 10
            if unique:
                final_lst.append(lst[i])
            if body_symbol_class not in all_body_part_classes and lst[i][0] != 'M':
                final_lst.append(f'S{body_symbol_class:03x}{lst[i][4:6]}{x}x{y}')

        return ''.join(final_lst)

    trans_list = []
    eaf = pympi.Elan.Eaf(file_path=elan_path)
    sign_annotations = eaf.get_annotation_data_for_tier("SIGN")
    for trans in sign_annotations:
        trans_list.append(trans[2])
    with open(output_path / 'signWriting_translation.txt', 'w') as file:
        for trans in trans_list:
            file.write(f'{fix_and_remove_duplicates(trans)}\n')


def text_to_speech(text, output_folder, name, gender='male'):
    """
    Convert text to speech with the specified gender.
    """
    output_file = output_folder / name
    output_wav = output_folder / 'output.wav'
    if gender not in ['male', 'female']:
        raise ValueError("Gender must be 'male' or 'female'")

    if gender == 'female':
        tts = gTTS(text=text, lang='en', slow=False)
        tts.save(output_file)

    else:
        engine = pyttsx3.init()
        voices = engine.getProperty('voices')
        # Select a male voice
        for voice in voices:
            if 'male' in voice.name.lower():
                engine.setProperty('voice', voice.id)
                break
        engine.save_to_file(text, str(output_wav))
        engine.runAndWait()
        command = ['ffmpeg', '-i', str(output_wav), '-codec:a', 'libmp3lame', '-qscale:a', '2', str(output_file)]
        subprocess.run(command)
        os.remove(output_wav)


def model_redict(image, x, y, w, h, model):
    # Crop the face from the image
    center_x = x + w / 2
    center_y = y + h / 2
    b_dim = min(max(w, h) * 1.2, image.width, image.height)
    box = (center_x - b_dim / 2, center_y - b_dim / 2, center_x + b_dim / 2, center_y + b_dim / 2)
    cr_pim = image.crop(box).resize((96, 96))

    # normalize the image
    im2Arr = np.asarray(cr_pim)
    x_test_nor = im2Arr.astype('float32') / 255.0
    x_test_nor = x_test_nor[np.newaxis, :]
    # predict
    prediction = model.predict(x_test_nor)
    return 1 if prediction[0][0] > 0.5 else 0


def classify_gender(image_path, model):
    # hyperparameters
    scaleFactor = 1.05
    minNeighbor = 3
    minSize = (20, 20)  # Minimum size of the face in pixels
    CascadeClassifier_path = "./translation/model_file/haarcascade_frontalface_alt.xml"

    if not os.path.exists(image_path):
        raise Exception(f"File {image_path} not found")
    faceCascade = cv2.CascadeClassifier(CascadeClassifier_path)

    # Check if the cascade file is loaded properly
    if faceCascade.empty():
        raise Exception("Error loading cascade file")
    image = cv2.imread(image_path)

    # Check if the image was loaded properly
    if image is None:
        raise Exception("Error loading image")
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

    # Using cv2 to detect faces
    faces = faceCascade.detectMultiScale(gray, scaleFactor, minNeighbor, minSize=minSize)
    if len(faces) == 0:
        raise Exception("No faces detected")

    # predict
    im = Image.open(image_path)
    main_face = max(faces, key=lambda rec: rec[2] * rec[3])
    (x, y, w, h) = main_face
    cv2.rectangle(image, (x, y), (x + w, y + h), (0, 255, 0), 4)
    label = model_redict(im, x, y, w, h, model)
    return label


def video_to_gender(video_path):
    """
    By analyzing the fotage of the video classefied the humen to gender.
    """
    video_path = str(video_path.absolute())
    result = [0, 0]
    # Load video and extract frames
    video = VideoFileClip(video_path)
    frames = list(video.iter_frames(fps=24, dtype='uint8'))
    sampled_frames = random.sample(frames, min(10, len(frames)))

    # Load model and predict labels
    label_dict = {0: 'female', 1: 'male'}
    model = load_model('./translation/model_file/gender_classify_middle_hiar_man.h5')
    for i, frame in enumerate(sampled_frames):
        cv2.imwrite(f'frame_{i}.jpg', cv2.cvtColor(frame, cv2.COLOR_RGB2BGR))
        try:
            res = classify_gender(f'frame_{i}.jpg', model)
            result[res] += 1
        except Exception:
            pass
        os.remove(f'frame_{i}.jpg')
        if abs(result[0] - result[1]) > 3:
            break

    return label_dict[result.index(max(result))]
