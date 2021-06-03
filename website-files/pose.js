function streamPose() {
	fetch('/pose_feed')
		.then(response => {
				const reader = response.body.getReader();
				reader.read().then(
					function processData({done, value}) {
						try {
							var poseData = JSON.parse(String.fromCharCode.apply(String, value));
							// update visualization on top left
							updateViz(poseData.poseKeypoints, poseData.poseWidth, poseData.poseHeight);
						
							// update feedbacks (after MVP)
						} catch (e) { }
						
						return reader.read().then(processData);
					});
				}
		);
};

function updateViz(poseKeypoints, poseWidth, poseHeight) {
	var canvas = document.getElementById('poseCanvas');
	var ctx = canvas.getContext('2d');
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	colors = {red: "#FF0000", darkOrange: "#FF8C00", orange: "#FFA500", yellow: "#CCCC00", lightGreen: "#00FF00", green: "#008000", darkGreen: "#006400", teal: "#008080", cyan: "#00FFFF", lightBlue: "#4fc3f7", medBlue: "#0277bd", darkBlue: "#0000FF", pink: "#FFC0CB", purple: "#800080"};
	
	colorPoint = [colors.red, colors.red, colors.darkOrange, colors.orange, colors.yellow, colors.lightGreen, colors.green, 
					colors.darkGreen, colors.red, colors.green, colors.teal, colors.cyan, colors.cyan, colors.lightBlue, colors.medBlue, 
					colors.darkBlue, colors.pink, colors.purple, colors.pink, colors.purple, colors.darkBlue, colors.darkBlue, colors.cyan, 
					colors.cyan, colors.cyan];
	
	var mapY = y => (canvas.height/poseHeight)*(y + 0.5) - 0.5;
	var mapX = x => (canvas.width/poseWidth)*(x + 0.5) - 0.5;
	for (var i = 0; i < poseKeypoints.length; i++) {
		poseKeypoints[i][0] = mapX(poseKeypoints[i][0]);
		poseKeypoints[i][1] = mapY(poseKeypoints[i][1]);
	}
	
	// draws the resized keypoints in [indices] and connects them with the correponding color
	function drawConnect(indices, confThresh=0.2) {
		// loop to first with conf >, draw it, store index. i++
		// while loop (while < n)
			// if not conf continue
			
			// if conf found draw line between prev and curr
			// set prev to curr
			// i++
		
		function drawPoint(coords, color="#000000") {
			var radius = 5;
			ctx.fillStyle = color;
			
			ctx.beginPath();
			ctx.arc(coords[0], coords[1], radius, 0, 2*Math.PI);
			ctx.fill();
		}
		
		function drawLine(start, end, color="#000000") {
			ctx.strokeStyle = color;
			ctx.lineWidth = 5;

			ctx.beginPath();
			ctx.moveTo(start[0],start[1]);
			ctx.lineTo(end[0],end[1]);
			ctx.stroke();
		}
					
		var i;
		
		for (i=0; i < indices.length; i++) {
			if (poseKeypoints[indices[i]][2] >= confThresh) {
				prevPoint = poseKeypoints[indices[i]].slice(0, 2);
				drawPoint(prevPoint, colorPoint[indices[i]]);
				break;
			}
		}
		i += 1;
		
		for (i; i < indices.length; i++) {
			if (poseKeypoints[indices[i]][2] < confThresh) continue;
			
			// found! draw and connect
			currPoint = poseKeypoints[indices[i]].slice(0, 2);
			drawPoint(currPoint, colorPoint[indices[i]]);
			drawLine(prevPoint, currPoint, colorPoint[indices[i]]);
			prevPoint = currPoint;
		}
	}
	
	drawConnect([0,15,17]); // left eye
	drawConnect([0,16,18]); // right eye
	drawConnect([0,1,2,3,4]); // neck & left arm
	drawConnect([1,5,6,7]); // right arm
	drawConnect([1,8,9,10,11,24]); // torso and left leg
	drawConnect([11,22,23]); // left foot
	drawConnect([8,12,13,14,21]); // right leg
	drawConnect([14,19,20]); // right foot	
}