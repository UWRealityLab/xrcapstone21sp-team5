import cv2
import numpy as np
import socket
from comms import *
import argparse
import time
from constants import *

import PIL
import PIL.Image
from PIL import ImageTk
from tkinter import *

import urllib.request
import base64

parser = argparse.ArgumentParser(description='webcam sender')
parser.add_argument('--width', type=int, nargs='?', default=480)
parser.add_argument('--height', type=int, nargs='?', default=270)
parser.add_argument('--camera_id', type=int, nargs='?', default=0)

args = parser.parse_args()
cam = cv2.VideoCapture(args.camera_id)

# this worked good for pose est. might need to change later
cam.set(cv2.CAP_PROP_FRAME_WIDTH, args.width)
cam.set(cv2.CAP_PROP_FRAME_HEIGHT, args.height)

sender = Sender(SERVER_ADDR, CAM_PORT)

root = Tk()
root.title('BallARs Webcam Application')

raw_img = urllib.request.urlopen("https://cdn.glitch.com/9a85a046-7a8a-4e1a-a03f-9054d9632e5c%2FBallARsLogo.png?v=1623048492155").read()
b64_img = base64.encodestring(raw_img)
img = PhotoImage(data=b64_img)
root.iconphoto(False, img)

root.bind('<Escape>', lambda e: root.quit()) # quit on escape
lmain = Label(root)
lmain.pack()

def show_send_frame():
        _, frame = cam.read()

        sender.send(frame, compress_image)

        imgtk = ImageTk.PhotoImage(image=PIL.Image.fromarray(cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)))
        lmain.imgtk = imgtk
        lmain.configure(image=imgtk)
        lmain.after(int(1000/FPS), show_send_frame)

show_send_frame()
root.mainloop()