from flask import Flask, render_template, Response, request, abort
from pose import *
from comms import *
from constants import *
import argparse

"""
    Web server main script
"""

app = Flask(__name__, template_folder=WEB_DIR)
reciever = Reciever(SERVER_ADDR, CAM_PORT)
state_dict = dict()

@app.after_request
def add_header(r):
    """
    Prevent caching videos/models
    """
    r.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
    r.headers["Pragma"] = "no-cache"
    r.headers["Expires"] = "0"
    return r

@app.route('/')
def index():
    return render_template('index.html')


@app.route('/trigger_start')
def trigger_start():
    if request.remote_addr in state_dict and (ServerStates.END_VIDEO not in state_dict[request.remote_addr] or ServerStates.END_GLB not in state_dict[request.remote_addr]):
        return ('', 204) # empty response (OK)
    state_dict[request.remote_addr] = set([ServerStates.RECORDING]) # start recording
    record_frames(reciever, request.remote_addr, state_dict)
    return ('', 204) # empty response (OK)

@app.route('/trigger_end_video')
def trigger_end_video():
    state_dict[request.remote_addr].add(ServerStates.START_VIDEO)
    state_dict[request.remote_addr].discard(ServerStates.RECORDING) # stop recording, process, and send back gltf
    vid = client_frames_to_mp4(request.remote_addr)
    state_dict[request.remote_addr].add(ServerStates.END_VIDEO)
    if vid is None:
        abort(500) # images not found for example
    return vid

@app.route('/trigger_end')
def trigger_end():
    if ServerStates.START_GLB in state_dict[request.remote_addr]:
        return ('', 204)
    state_dict[request.remote_addr].add(ServerStates.START_GLB)
    state_dict[request.remote_addr].discard(ServerStates.RECORDING) # stop recording, process, and send back gltf
    glb = gen_poses(request.remote_addr)
    state_dict[request.remote_addr].add(ServerStates.END_GLB)
    if glb is None:
        abort(500) # error creating glb
    return glb

app.run(host=SERVER_ADDR, port=WEB_PORT, ssl_context='adhoc')

