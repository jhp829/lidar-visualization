AFRAME.registerComponent("controller-listener", {
  init: function () {

      //X-button Pressed
      this.el.addEventListener("xbuttondown", function (e) {
          this.emit("teleportstart");
      });

      //X-button Released
      this.el.addEventListener("xbuttonup", function (e) {
          this.emit("teleportend");
      });

  }
});