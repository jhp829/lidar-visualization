AFRAME.registerComponent('point-cloud-loader', {
  schema: {},

  points: new Map(),
  loaded_points: new Map(),
  lidar_file_path: '../components/',

  init: function () {
    this.points.set(0, {
      x: 1,
      y: 1,
      z: 1
    })
    this.add_point(0)
  },

  load_new_file: function(file_name) {
    // TODO: load the file and load an initial 200ms worth of points
  },

  add_point: function (point_index) {
    var point = this.points.get(point_index)

    // create point element
    var point_element = document.createElement('a-sphere');

    // set attributes
    var position = { x: point.x, y: point.y, z: point.z }
    point_element.setAttribute('position', position);
    point_element.setAttribute('scale', { x: 0.05, y: 0.05, z: 0.05 });
    point_element.setAttribute('color', '#F5E942');

    // append it to the scene
    this.el.appendChild(point_element)

    // add it to the list of loaded points so it can be easily removed later
    this.loaded_points.set(point_index, point_element)
  }
});