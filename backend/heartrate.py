import cv2
import os
from scipy.signal import butter, filtfilt
import heartpy as hp
from PIL import Image
import numpy as np
import matplotlib.pyplot as plt

dur = 0
# Function to extract frames from the video and find the sampling rate
def extract_frames_and_sampling_rate(video_filename, output_directory):
    # Create the output directory if it doesn't exist
    os.makedirs(output_directory, exist_ok=True)

    # Open the video file
    cap = cv2.VideoCapture(video_filename)

    frames = cap.get(cv2.CAP_PROP_FRAME_COUNT) 
    fps = cap.get(cv2.CAP_PROP_FPS) 
  
#    calculate duration of the video 
    global dur
    dur = round(frames / fps)
    # Initialize frame count
    frame_count = 0

    # Read until video is completed
    while cap.isOpened():
        # Capture frame-by-frame
        ret, frame = cap.read()
        if not ret:
            break

        # Save the frame
        frame_filename = os.path.join(output_directory, f'frame_{frame_count}.jpg')
        cv2.imwrite(frame_filename, frame)

        # Increment frame count
        frame_count += 1

    # Release the video capture object
    cap.release()



def get_image(image_path):
    '''
    Return a numpy array of red image values so that we can access values[x][y]
    '''
    image = Image.open(image_path)
    width, height = image.size
    red, green, blue = image.split()
    red_values = list(red.getdata())
    return np.array(red_values).reshape((width, height))

def get_mean_intensity(image_path):
    '''
    Return mean intensity of an image values
    '''
    image = get_image(image_path)
    return np.mean(image)

def plot(x):
    '''
    Plot the signal
    TODO: Vertical flip and plot a normal PPG signal instead of an inverted one
    '''
    fig = plt.figure(figsize=(13, 6))
    ax = plt.axes()
    ax.plot(list(range(len(x))), x)
    plt.show()

def get_signal_from():
    '''
    Return PPG signal as a sequence of mean intensities from the sequence of
    images that were captured by a device (NoIR camera or iphone camera)
    '''
 
    dir = 'frames/'
    length = len(os.listdir(dir))
    x = []
    for j in range(length):
        image_path = dir+'frame_'+str(j)+'.jpg'
        print('reading image: ' + image_path)
        x.append(get_mean_intensity(image_path))
    return x


def butter_bandpass(lowcut, highcut, fs, order=5):
    nyq = 0.5 * fs
    low = lowcut / nyq
    high = highcut / nyq
    b, a = butter(order, [low, high], btype='band')
    return b, a

def butter_bandpass_filter(data, lowcut, highcut, fs, order=5):
    b, a = butter_bandpass(lowcut, highcut, fs, order=order)
    y = filtfilt(b, a, data)
    return y

def getHR(filename):

    output_directory = 'frames/'
    extract_frames_and_sampling_rate(filename, output_directory)

    x = get_signal_from()
# Define the cutoff frequencies and order of the filter
    lowcut = 0.5  # Lower cutoff frequency in Hz
    highcut = 10.0  # Upper cutoff frequency in Hz
    order = 4  # Filter order

# Apply the bandpass filter to the PPG signal
    filtered_ppg_signal = butter_bandpass_filter(x, lowcut, highcut, len(x)/dur, order)

# Process the filtered PPG signal with HeartPy
    wd_filtered, m_filtered = hp.process(filtered_ppg_signal, sample_rate=len(x)/dur)

# # Plot the filtered PPG signal
#     plt.figure(figsize=(12, 4))
#     plt.plot(filtered_ppg_signal, label='Filtered PPG Signal')
#     plt.title('Filtered PPG Signal')
#     plt.xlabel('Sample')
#     plt.ylabel('Amplitude')
#     plt.legend()
#     plt.grid(True)
#     plt.show()

# Plot HeartPy's processing results on the filtered signal
    # plt.figure(figsize=(12, 6))
    # hp.plotter(wd_filtered, m_filtered)
    # plt.show()


    # for measure in m_filtered.keys():
    #     print('%s: %f' %(measure, m_filtered[measure]))

    return m_filtered

if __name__ == "__main__":
    # Have an end point here
    print(getHR("sample.mp4"))


    