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
    Given the image sequence, generate the glb file, return it
"""
def gen_poses(client_addr):
    client_dir = os.path.join(TMP_BASE_DIR, client_addr)
    
    output_path = os.path.join(client_dir, 'output/')
    thetas_path = os.path.join(output_path, 'thetas/')
    glb_path = os.path.join(output_path, 'out.glb')
    
    try:
        os.makedirs(output_path)
    except:
        pass    
    
    vibe_cmd = f"python {os.path.join(VIBE_DIR, 'demo_alter.py')} --client_dir {client_dir} --no_render"
    os.system(vibe_cmd) # gen vibe results
    
    """ SMPL model """
    # glb_cmd = f"python {os.path.join(vibe_path, 'lib/utils/fbx_output.py')} --input {os.path.join(client_dir, 'output/vibe_output.pkl')} --output {os.path.join(client_dir, 'output/glb_output.glb')} --fps_source 30 --fps_target 30 --gender male --person_id 3"
    
    
    theta_paths = os.listdir(thetas_path)
    
    if len(theta_paths) == 0:
        return
    
    theta_path = os.path.join(thetas_path, theta_paths[0])
    
    """ 2K model """
    glb_cmd = f"python {os.path.join(TK_DIR, 'save_gltf.py')} --theta_path {theta_path} --output_path {glb_path}"
    os.system(glb_cmd) # gen glb
    
    # read glb (binary)
    with open(glb_path, 'rb') as f:
        glb = f.read()
        
    # return glb file
    return glb

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