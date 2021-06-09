"""
    CONSTANTS
"""
from enum import Enum

WEB_DIR = 'C:/Users/ballars/Documents/481v-server/team5/website-files/' # where website files are
TMP_BASE_DIR = 'C:/Users/ballars/Documents/481v-server/team5/tmp_usr_data/' # where to store temp user data
VIBE_DIR = 'C:/Users/ballars/Documents/481v-server/team5/client-webserver/VIBE/' # path to vibe
TK_DIR = VIBE_DIR + 'retargetting/' # 2k path
SERVER_ADDR = '128.208.1.212' # server addr
WEB_PORT = 80 # port to serve web requests
CAM_PORT = 81 # port to serve webcam feed
MAX_FRAMES=100 # maximum number of frames / shot
THRESH_STALE=5 # filter out the first THRESH_STALE frames since we normally have some stale frames in the socket buffer

MIN_NUM_FRAMES=25 # min number of frames allowed for retargeting
FPS=25 # fps to process retargeting at

class ServerStates(Enum):
    RECORDING = 0
    
    START_VIDEO = 1
    START_GLB = 2
    
    END_VIDEO = 3
    END_GLB = 4