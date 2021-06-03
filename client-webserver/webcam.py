import cv2
import numpy as np
import socket
from comms import *
import argparse
import time
from constants import *

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

while True:
        _, frame = cam.read()

        sender.send(frame, compress_image)

        """ For seeing compression savings & result """
        #cv2.imshow('img', deserialize_image(serialize_image(frame)))
        #print(len(frame.tostring()), len(ser))
        #print(100*(len(frame.tostring()) - len(ser))/len(ser))
        
        if cv2.waitKey(1) & 0xFF == ord('q'):
                break


        time.sleep(1/FPS) # get ~FPS fps

cam.release()
cv2.destroyAllWindows()