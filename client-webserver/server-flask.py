from flask import Flask, render_template, Response, request
from pose import *
from comms import *
from constants import *
import argparse

app = Flask(__name__, template_folder=WEB_DIR)
reciever = Reciever(SERVER_ADDR, CAM_PORT)
record = dict()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/trigger_start')
def trigger_start():
    record[request.remote_addr] = True # start recording
    record_frames(reciever, request.remote_addr, record)
    return 'OK'

@app.route('/trigger_end')
def trigger_end():
    record[request.remote_addr] = False # stop recording, process, and send back gltf
    return gen_poses(request.remote_addr)

app.run(host=SERVER_ADDR, port=WEB_PORT, ssl_context='adhoc')
