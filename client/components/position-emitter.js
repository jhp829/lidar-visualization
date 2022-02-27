AFRAME.registerComponent("position-emitter", {
  init: function () {
      var outer_this = this

      //publishes position when teleporting is finished
      this.el.addEventListener("emit-position", function (e) {
          var positionVec = this.el.getAttribute("position")
          var position = {
            x: positionVec.x,
            y: positionVec.y, 
            z: positionVec.z
          }
          this.emit("new-position", position);
      }, true);

  }
});