AFRAME.registerComponent("trigger", {
  init: function () {
    let controller = this.el;
    controller.linearVelocities = [5];
    controller.previousPosition = undefined;
    controller.next = 0;
    this.ball = document.getElementById("basketball");

    this.moveBall = e => {
      this.ball.object3D.position.set(
        e.detail.controllerPosition.x,
        e.detail.controllerPosition.y,
        e.detail.controllerPosition.z
      );
      this.ball.object3D.rotation.set(0, 0, 0);
    };

    this.ball.sceneEl.addEventListener("controllerMove", this.moveBall);

    this.shoot = () => {
      // Clear the previous feedback
      document
        .getElementById("feedback")
        .setAttribute("text", { value: "Anaylzing Shot" });

      // Set up parameters to calculate the feedback

      this.wentIn = false;
      this.feedback = "";

      let index = 0;
      let indexedLinearVelocities = [5]
      while (index < 5) {
        indexedLinearVelocities[index] = controller.linearVelocities[(index + controller.next) % 5];
        index++;
      }

      this.totalXlinVel = 0;
      this.totalYlinVel = 0;
      this.totalZlinVel = 0;

      let weights = [0.5, 0.5, 1.0, 2.0, 2.0]

      for (let i = 0; i < 5; i++) {
        this.totalXlinVel += (indexedLinearVelocities[i].x) * weights[i];
        this.totalYlinVel += (indexedLinearVelocities[i].y) * weights[i];
        this.totalZlinVel += (indexedLinearVelocities[i].z) * weights[i];
      }
      let linearVelocity = new THREE.Vector3();

      var ballPos = new THREE.Vector3();
      this.ball.object3D.getWorldPosition(ballPos);

      this.hoop = document.getElementById("hoop");
      var hoopPos = new THREE.Vector3();
      this.hoop.object3D.getWorldPosition(hoopPos);

      let deltaZ = Math.abs(hoopPos.z - ballPos.z)
      let deltaY = Math.abs(hoopPos.y - ballPos.y)
      let deltaX = Math.abs(hoopPos.x - ballPos.x)

      let setZLinearVelocity = Math.sqrt(Math.abs((4.9 * deltaZ * deltaZ) / ((this.totalYlinVel / this.totalZlinVel) * deltaZ - deltaY)));
      let setYLinearVelocity = Math.abs(setZLinearVelocity * (this.totalYlinVel / this.totalZlinVel));

      let setXLinearVelocity = Math.sqrt(Math.abs((4.9 * deltaX * deltaX) / ((this.totalYlinVel / this.totalXlinVel) * deltaX - deltaY)));
      let secondYLinearVelocity = Math.abs(setXLinearVelocity * (this.totalYlinVel / this.totalXlinVel));
      setXLinearVelocity *= setYLinearVelocity / secondYLinearVelocity;
      secondYLinearVelocity *= setYLinearVelocity / secondYLinearVelocity;

      if (this.totalXlinVel < 0) {
        setXLinearVelocity *= -1;
      }

      if (this.totalYlinVel < 0) {
        setYLinearVelocity *= -1;
      }

      if (this.totalZlinVel < 0) {
        setZLinearVelocity *= -1;
      }


      linearVelocity.set(this.totalXlinVel / 5 + setXLinearVelocity * 0.95, this.totalYlinVel / 5 + setYLinearVelocity * 0.95, this.totalZlinVel / 5 + setZLinearVelocity * 0.95);


      let angularVelocity = new THREE.Vector3();
      angularVelocity.set(5, 0, 0);

      // set the velocity of the ball to our velocity vector
      this.ball.sceneEl.removeEventListener("controllerMove", this.moveBall);
      this.ball.setAttribute("body", { type: "dynamic", shape: "sphere", mass: "300" });

      this.ball.body.velocity.copy(linearVelocity);
      this.ball.body.angularVelocity.copy(angularVelocity);

      this.ball.addEventListener("collide", this.trackCollision);
      setTimeout(() => {
        let winnersPOV = document.getElementById("win");
        winnersPOV.setAttribute("visible", false);
        this.ball.removeEventListener("collide", this.trackCollision);
        this.ball.removeAttribute("body");
        this.el.sceneEl.addEventListener("controllerMove", this.moveBall);

        document
          .getElementById("feedback")
          .setAttribute("text", { value: this.feedback });

		var mesh = document.getElementById("3DModel");
		mesh.setAttribute("gltf-model", "/trigger_end?t="+ new Date().getTime()); // so it reloads
		
        const hoopPosition = new THREE.Vector3();
              document.getElementById("hoop").object3D.getWorldPosition(hoopPosition);
        const userPosition = new THREE.Vector3();
              document.getElementById("controller").object3D.getWorldPosition(userPosition);
        
        const ratio = (hoopPosition.x - userPosition.x) / (hoopPosition.z - userPosition.z);
        const radian = Math.atan(ratio);
        
        mesh.object3D.rotation.set(0, radian + 0.26, 0);
		mesh.setAttribute("visible", true);
		// sceneEl.appendChild(entityEl);

        var video = document.getElementById('video');
        video.setAttribute("src", "/trigger_end_video?t="+ new Date().getTime()); // so it reloads
        video.setAttribute("visible", true);
      }, 3000);
    };
    controller.addEventListener("triggerup", this.shoot);

    this.beginShooting = () => {
		// Send an http request when trigger is pressed
      const Http = new XMLHttpRequest();
      const url = '/trigger_start';
      Http.open("GET", url);
      Http.send();
	  
	  // remove the old person if exists
	  var mesh = document.getElementById('3DModel');
	  mesh.setAttribute("visible", false);
	  
	  var video = document.getElementById('video')
      // video.pause();
	  video.setAttribute("src", "");
      video.setAttribute("visible", false);
    };
    controller.addEventListener("triggerdown", this.beginShooting);

    // Collide and Collision events for feedback algorithm
    let backboard_left = document.getElementById("backboard-left");
    backboard_left.addEventListener("collisions", (e) => {
      if (this.feedback == undefined) return;
      if (!this.wentIn && !this.feedback.includes("right")) this.feedback += "\r\n Try Shooting a bit to your right";
    });

    let backboard_right = document.getElementById("backboard-right");
    backboard_right.addEventListener("collisions", (e) => {
      if (this.feedback == undefined) return;
      if (!this.wentIn && !this.feedback.includes("left")) this.feedback += "\r\n Try Shooting a bit to your left";
    });

    let backboard_up = document.getElementById("backboard-up");
    backboard_up.addEventListener("collisions", (e) => {
      if (this.feedback == undefined) return;
      if (!this.wentIn && !this.feedback.includes("weaker")) this.feedback += "\r\n Try Shooting a bit weaker";
    });

    let backboard_down = document.getElementById("backboard-down");
    backboard_down.addEventListener("collisions", (e) => {
      if (this.feedback == undefined) return;
      if (!this.wentIn && !this.feedback.includes("stronger")) this.feedback += "\r\n Try Shooting a bit stronger";
    });

    let detector = document.getElementById("detector");
    detector.addEventListener("collisions", (e) => {
      this.feedback = "Great Shot!";
      this.wentIn = true;
      if (e.detail.els.length != 0 && e.detail.els[0].id === "basketball") {
        let winnersPOV = document.getElementById("win");
        winnersPOV.setAttribute("visible", true);
      }
    });

    let rim = document.getElementById("rim");
    rim.addEventListener("collide", (e) => {
      this.feedback = "Close One!";
      this.wentIn = true;
    });


  },

  tick: function (time, timeDelta) {
    let controller = this.el;
    var ballPos = new THREE.Vector3();

    this.ball.object3D.getWorldPosition(ballPos);
    if (controller.previousPosition == undefined) {
      controller.previousPosition = ballPos.clone();
    }
    let linearVelocity = new THREE.Vector3();
    linearVelocity.set(
      (ballPos.x - controller.previousPosition.x) / (timeDelta / 1000.0),
      (ballPos.y - controller.previousPosition.y) / (timeDelta / 1000.0),
      (ballPos.z - controller.previousPosition.z) / (timeDelta / 1000.0)
    );

    if (linearVelocity.x != 0) {
      controller.linearVelocities[controller.next] = linearVelocity;

      if (++controller.next > 5) {
        controller.next = 0;
      }
      controller.previousPosition = ballPos.clone();
    }
  },

  remove: function () {
    this.el.removeEventListener("triggerup", this.shoot);
  }
});
