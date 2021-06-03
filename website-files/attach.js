AFRAME.registerComponent("rotation-reader", {
  tick: function () {
    this.el.emit("controllerMove", { controllerPosition: this.el.object3D.position, controllerRotation: this.el.object3D.quaternion });
  }
});

