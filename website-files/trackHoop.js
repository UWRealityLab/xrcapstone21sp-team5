AFRAME.registerComponent("track-hoop", {
    init: function () {
        let controller = this.el;
        this.hoop = document.getElementById("hoop");
        this.pointer = document.getElementById("pointer");

        this.movePointer = e => {
            this.pointer.object3D.position.set(
                e.detail.controllerPosition.x,
                e.detail.controllerPosition.y + 0.2,
                e.detail.controllerPosition.z
            );
            this.hoopPosition = new THREE.Vector3();
            this.hoop.object3D.getWorldPosition(this.hoopPosition);
            this.pointerPosition = new THREE.Vector3();
            this.pointer.object3D.getWorldPosition(this.pointerPosition);

            if (this.hoopPosition.x - this.pointerPosition.x > 0) {
                this.pointer.object3D.rotation.set(0, Math.PI / 2, Math.PI / 2); // hoop is to the right
            } else if ((this.hoopPosition.x - this.pointerPosition.x >= -0.25) && (this.hoopPosition.x - this.pointerPosition.x <= 0.25)) {
                this.pointer.object3D.rotation.set(-Math.PI / 2, 0, 0); // hoop is up
            } else {
                this.pointer.object3D.rotation.set(0, -Math.PI / 2, -Math.PI / 2); // hoop is to the left
            }
        };

        this.pointer.sceneEl.addEventListener("controllerMove", this.movePointer);

        this.togglePointer = () => {
            let point = document.getElementById("pointer");
            let visbility = point.getAttribute("visible");
            console.log("visibility is " + visbility);
            this.pointer.setAttribute("visible", !visbility);

        };
        controller.addEventListener("touchpadmoved", this.togglePointer);

    },

    remove: function () {
        this.el.removeEventListener("touchpadmoved", this.togglePointer);
    }
});