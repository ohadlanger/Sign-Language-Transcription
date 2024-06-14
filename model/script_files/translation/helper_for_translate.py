from gtts import gTTS
import os
import pyttsx3
import cv2
from keras.models import load_model
import numpy as np
from PIL import Image
from moviepy.editor import VideoFileClip
import subprocess


def signWriting_to_text(signWriting_path):
    return ['like', 'hot', 'chocolate', 'later']


def pose_to_signWriting(pose_path, elan_path, model='bc2de71.ckpt', strategy='wide'):
    """
    This function takes a pose file and translates it to signWriting.
    """
    pose_path = str(pose_path.absolute())
    cmd = ['pose_to_signwriting', f'--pose={pose_path}', f'--elan={elan_path}', f'--strategy={strategy}',
           f'--model={model}']
    with subprocess.Popen(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE) as sub:
        sub.wait()


def text_to_speech(text, output_file, gender='male'):
    """
    Convert text to speech with the specified gender.
    """
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
        engine.say(text)
        engine.save_to_file(text, output_file)


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
    CascadeClassifier_path = "./../translation/model_file/haarcascade_frontalface_alt.xml"

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
    frames = video.iter_frames(fps=1, dtype='uint8')

    # Load model and predict labels
    label_dict = {0: 'female', 1: 'male'}
    model = load_model(
        './model_file/gender_classify_middle_hiar_man.h5')

    for i, frame in enumerate(frames):
        if i == 3:
            break
        cv2.imwrite(f'frame_{i}.jpg', cv2.cvtColor(frame, cv2.COLOR_RGB2BGR))
        try:
            res = classify_gender(f'frame_{i}.jpg', model)
            result[res] += 1
        except Exception:
            pass
        os.remove(f'frame_{i}.jpg')

    return label_dict[result.index(max(result))]
