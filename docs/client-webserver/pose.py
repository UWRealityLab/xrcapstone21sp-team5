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
def record_frames(reciever, client_addr, record):
    client_dir = os.path.join(TMP_BASE_DIR, client_addr)
    
    img_path = os.path.join(client_dir, 'images/')
    
    try:
        os.makedirs(img_path)
    except:
        print('This client is already being recorded, cannot start again until done with current job.')
        return

    i = 0
    while record[client_addr]:
        image = reciever.get(client_addr, decompress_image)
        cv2.imwrite(os.path.join(img_path, f'{i}.png'), image)
        i += 1

"""
    Given the image sequence, generate the glb file, return it
"""
def gen_poses(client_addr):
    client_dir = os.path.join(TMP_BASE_DIR, client_addr)
       
    try:
        os.makedirs(os.path.join(client_dir, 'output/'))
    except:
        print('This client is already being processed, cannot start again until done with current job.')
        return 'BAD'
    
    
    vibe_cmd = f"python {os.path.join(VIBE_DIR, 'demo_alter.py')} --client_dir {client_dir} --no_render"
    os.system(vibe_cmd) # gen vibe results
    
    """ SMPL model """
    # glb_cmd = f"python {os.path.join(vibe_path, 'lib/utils/fbx_output.py')} --input {os.path.join(client_dir, 'output/vibe_output.pkl')} --output {os.path.join(client_dir, 'output/glb_output.glb')} --fps_source 30 --fps_target 30 --gender male --person_id 3"
    
    output_path = os.path.join(client_dir, 'output/')
    
    thetas_path = os.path.join(output_path, 'thetas/')
    theta_paths = os.listdir(thetas_path)
    
    if len(theta_paths) == 0:
        shutil.rmtree(client_dir)
        return 'BAD'
    
    theta_path = os.path.join(thetas_path, theta_paths[0])
    
    """ 2K model """
    glb_cmd = f"python {os.path.join(TK_DIR, 'save_gltf.py')} --theta_path {theta_path} --output_path {os.path.join(output_path, 'out.glb')}"
    os.system(glb_cmd) # gen glb
    
    # read glb (binary)
    with open(os.path.join(client_dir, 'output/out.glb'), 'rb') as f:
        glb = f.read()
    
    # return the client dir, don't need it anymore
    #shutil.rmtree(client_dir)
    
    # return glb file
    return glb