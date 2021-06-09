# BallArs 

BallARs is an augmented reality application that allows users to practice their basketball shooting skills by having the opportunity to shoot a virtual basketball into a virtual hoop and gain feedback from in-game physics and pose estimation. What makes our app unique is we will have a retargeted model to showcase how the user shot and compare their shot to an NBA player.

Devices used for this project are Magic Leap 1

---- 
GPU Link: https://128.208.1.212:80/  

Glitch Link: https://mvp-ballars.glitch.me/  

GitHub Link: https://github.com/UWRealityLab/xrcapstone21sp-team5  

Blog Link: https://uwrealitylab.github.io/xrcapstone21sp-team5/index.html

----

## Server Installation (Windows only)
On the server:
1. Clone the repo
2. Follow what's in this tutorial: https://github.com/carlosedubarreto/vibe_win_install up to and not including "Blender addon to import data".
3. Insure that the contents of the repo in (1) should be in the same level as the contents of the official VIBE respository.
4. Bring all the contents from (1) into the `VIBE/` folder of our repository.
5. Swap out the `demo_alter.py`, `lib/core/config.py`, `lib/utils/demo_utils.py` script with ours.
6. Ensure that `retargetting/` in the same level as `demo_alter.py`.
7. Modify the constants in constants.py to point to the right directories (must be absolute) and have the parameters (e.g. FPS) that you want.
8. Make sure you're in the venv_vibe conda environment
9. Do `pip install -r requirements-server.txt`
10. Download blender version 2.82a https://download.blender.org/release/Blender2.82/blender-2.82a-windows64.zip
11. Place the `2.82/` folder in the same folder as the python installation.
12. Restart anaconda
13. Make sure you're in the venv_vibe conda environment
14. Run `python server-flask.py` on your web server *from inside the client-webserver directory* (or it will not work).

It shouldn't be too much work to get this working on Linux. The server we used had Windows 10 preinstalled so we just used that. 

## Client Installation
On the client:
1. Clone the repo
2. Run `pip install -r requirements-webcam.txt`
3. Ensure that `constants.py` is consistent with the server.
4. Run `webcam.py`

## Magic Leap
On the magic leap, visit the server address (make sure to append `https` at the beginning) and you should be good to go!
