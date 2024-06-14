import moviepy.editor as mp

video = mp.VideoFileClip('/Users/rotemzilberman/Documents/Bsc/final_Project/Sign-Language-Translation/model/script_files/video/5 Second Countdown HD (240p).mp4')

# Check if original video has fps
original_fps = video.reader.fps
print(f"Original video FPS: {original_fps}")

# Use FPS from original video if available
if original_fps is not None:
    fps = original_fps
else:
    # Set a desired FPS if original is missing
    fps = 24  # Adjust as needed

# Write the video file
video.write_videofile('new.mp4', fps=fps)