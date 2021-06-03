# Repo for Team 5 in UW CSE 481V - BallARs

## How to run pose estimation
Run webcam.py with the following options:
`python webcam.py --server_addr <web server address> --server_port <--cam_port that's passed in to the server-flask script (normally 81)>`

## How to run web server
Run server-flask.py with the following options:
`python server-flask.py --server_addr <public ip of server> --server_port <port to use for web services (normally 80)> --cam_port <port to use for webcam (same as --server_port for webcam.py)>`
