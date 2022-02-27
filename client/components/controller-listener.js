AFRAME.registerComponent("controller-listener", {
  init: function () {
      var outer_this = this

      //X-button Pressed
      this.el.addEventListener("xbuttondown", function (e) {
          this.emit("teleportstart");
      });

      //X-button Released
      this.el.addEventListener("xbuttonup", function (e) {
          this.emit("teleportend");
          setTimeout(() => {outer_this.emit("emit-position")}, 50)
      });

  }
});