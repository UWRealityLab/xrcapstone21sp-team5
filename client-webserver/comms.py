import cv2
import numpy as np
from socket import *
import pickle
import os
import sys
from sys import platform
import json

compress_image = lambda frame: cv2.imencode('.jpg', frame, [cv2.IMWRITE_JPEG_QUALITY, 70])[1]

decompress_image = lambda compressed_img: cv2.imdecode(compressed_img, cv2.IMREAD_COLOR)

class Sender:
        def __init__(self, addr, port):
                """
                        Sets up sender-side UDP protocol
                """
                self.socket = socket(AF_INET, SOCK_DGRAM)
                self.addr = addr
                self.port = port
                self.seq_num = 0

        def __del__(self):
                """
                        Close up connection
                """
                self.socket.close()

        def send(self, data, compressor):
                """
                        Compress and send off.
                """
                
                compressed = compressor(data)
                ser = pickle.dumps({'seq_num': self.seq_num, 'compressed_data': compressed})
                self.socket.sendto(ser, (self.addr, self.port))
                self.seq_num += 1

class Reciever:
        def __init__(self, addr, port):
                """
                        Sets up reciever-side UDP protocol
                """
                self.socket = socket(AF_INET, SOCK_DGRAM)
                self.socket.bind((addr, port))
                self.seq_nums = dict()
        
        def __del__(self):
                """
                        Close up connection
                """
                self.socket.close()

        def get(self, client_addr, decompressor):
                """
                        Deserialize and return.
                """
                while True:
                        data, addr = self.socket.recvfrom(60000, MSG_PEEK)
                        addr = addr[0]
                        if addr == client_addr: self.socket.recvfrom(60000)
                        else: continue
                        
                        data = pickle.loads(data)
                        
                        seq_num, compressed = data['seq_num'], data['compressed_data']

                        if addr not in self.seq_nums or seq_num > self.seq_nums[addr]:
                                self.seq_nums[addr] = seq_num
                                return decompressor(compressed)