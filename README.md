# BallArs 

BallARs is an augmented reality application that allows users to practice their basketball shooting skills by having the opportunity to shoot a virtual basketball into a virtual hoop and gain feedback from in-game physics and pose estimation. What makes our app unique is we will have a retargeted model to showcase how the user shot and compare their shot to an NBA player.

Devices used for this project are Magic Leap 1

---- 
Glitch Link: https://mvp-ballars.glitch.me/  

GitHub Link: https://github.com/UWRealityLab/xrcapstone21sp-team5  

Blog Link: https://uwrealitylab.github.io/xrcapstone21sp-team5/index.html
----

## Server Installation (Windows only)
On the server:
1. Clone the repo
2. Modify the constants in constants.py to point to the right directories (must be absolute) and have the parameters (e.g. FPS) that you want. Don't worry about VIBE\_DIR, TK\_DIR since we do not have retargeting in this repo since much of that code is not public yet.
3. Do `pip install -r requirements-server.txt`
4. Make sure ffmpeg is added to `PATH` (check by typing `ffmpeg` in the command prompt)
5. Restart anaconda
6. Run `python server-flask.py` on your web server *from inside the client-webserver directory* (or it will not work).

It shouldn't be too much work to get this working on Linux. The server we used had Windows 10 preinstalled so we just used that. 

## Client Installation
On the client:
1. Clone the repo
2. Run `pip install -r requirements-webcam.txt`
3. Ensure that `constants.py` is consistent with the server.
4. Run `webcam.py`

## Magic Leap
On the magic leap, visit the server address (make sure to append `https` at the beginning) and you should be good to go!
