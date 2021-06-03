AFRAME.registerComponent('disable-culling', {
  init: function(){
	var el = this.el;
	el.addEventListener('model-loaded', () => {
	const model = el.getObject3D('mesh');
	model.traverse((node) => {
	  if (node.isMesh) {
		node.frustumCulled = false;
	  }
	});
  });
  }
});