import cv2
import numpy as np
from socket import *
import pickle
import os
import sys
from sys import platform
import json
from comms import *
import shutil
from constants import *

"""
    Record frames until record[client_addr] = False (we released the trigger)
"""
def record_frames(reciever, client_addr, state_dict):
    client_dir = os.path.join(TMP_BASE_DIR, client_addr)
    img_path = os.path.join(client_dir, 'images/')
    
    if os.path.exists(client_dir):
        shutil.rmtree(client_dir)
    
    os.makedirs(img_path)
    
    i = 0
    while ServerStates.RECORDING in state_dict[client_addr] and i < MAX_FRAMES:
        image = reciever.get(client_addr, decompress_image)
        if i >= THRESH_STALE:
            cv2.imwrite(os.path.join(img_path, f'{i - THRESH_STALE}.png'), image)
        i += 1

"""
    Convert the image sequence to an mp4
"""
def client_frames_to_mp4(client_addr):
    client_dir = os.path.join(TMP_BASE_DIR, client_addr)
    output_dir = os.path.join(client_dir, 'output/')
    img_dir = os.path.join(client_dir, 'images/')
    
    try:
        os.makedirs(output_dir)
    except:
        pass
    
    if len(os.listdir(img_dir)) == 0:
        return
    
    vid_path = os.path.join(output_dir, 'vid.mp4')

    img_to_vid_cmd = f"ffmpeg -n -r {FPS} -i {img_dir}/%d.png -vcodec libx264 -pix_fmt yuv420p {vid_path}"
    os.system(img_to_vid_cmd)
    
    with open(vid_path, 'rb') as f:
        vid = f.read()
    
    return vid
