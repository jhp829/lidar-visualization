AFRAME.registerComponent('point-cloud-loader', {
  schema: {},

  points: new Map(),
  loaded_points: new Map(),
  lidar_file_path: '../components/',

  init: function () {
      
  },

  load_new_file: function(file_name) {
    // TODO: load the file and load an initial 200ms worth of points
  },

  add_point: function (point_index) {
    var point = points[point_index]

    // create point element
    var point_element = document.createElement('a-sphere');

    // set attributes
    var position = { x: point.x, y: point.y, z: point.z }
    new_product.setAttribute('position', position);
    new_product.setAttribute('scale', { x: 0.05, y: 0.05, z: 0.05 });
    new_product.setAttribute('color', '#F5E942');

    // append it to the scene
    this.el.appendChild(point_element)
  }
});