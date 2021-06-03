let flag = false;

AFRAME.registerComponent("move-hoop", {
    init: function () {
        let controller = this.el;
        this.hoop = document.getElementById("hoop");
        this.control = document.getElementById("controller");

        this.moveHoop = e => {
            if (flag) {
                const oldPos = this.oldHoopPosition;
                const oldControl = this.oldControllerPosition;

                this.newControllerPosition = new THREE.Vector3();
                this.control.object3D.getWorldPosition(this.newControllerPosition);

                this.hoop.object3D.position.set(
                    oldPos.x + (e.detail.controllerPosition.x - oldControl.x) * 5,
                    oldPos.y + (e.detail.controllerPosition.y - oldControl.y) * 5,
                    oldPos.z + (e.detail.controllerPosition.z - oldControl.z) * 5
                );
                this.newRotation = new THREE.Quaternion();
                this.control.object3D.getWorldQuaternion(this.newRotation);

                this.hoop.object3D.quaternion.set(
                    this.newRotation.x,
                    e.detail.controllerRotation.y,
                    this.newRotation.z,
                    this.newRotation.w,
                );
            }
        };

        this.startMoveHoop = () => {
            let ball = document.getElementById("basketball");
            ball.setAttribute("visible", false);
            flag = true;
            this.oldHoopPosition = new THREE.Vector3();
            this.hoop.object3D.getWorldPosition(this.oldHoopPosition);
            this.oldControllerPosition = new THREE.Vector3();
            this.control.object3D.getWorldPosition(this.oldControllerPosition);
        };

        this.endMoveHoop = () => {
            let ball = document.getElementById("basketball");
            ball.setAttribute("visible", true);
            flag = false;
        };

        this.hoop.sceneEl.addEventListener("controllerMove", this.moveHoop);
        controller.addEventListener("gripdown", this.startMoveHoop);
        controller.addEventListener("gripup", this.endMoveHoop);
    },

    remove: function () {
        this.el.removeEventListener("gripdown", this.startMoveHoop);
        this.el.removeEventListener("gripup", this.endMoveHoop);
    }
});
