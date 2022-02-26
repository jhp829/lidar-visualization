AFRAME.registerComponent('point-cloud-loader', {
  schema: {},

  points: new Map(),
  min_loaded_index: 0,
  max_loaded_index: 0,
  loaded_points: new Map(),
  lidar_file_path: '../components/',
  time_offset: 0,
  window_size: 200, // in milliseconds

  init: function () {
    this.load_new_file('data_235.json')
  },

  load_new_file: function(file_name) {
    // reset all tracking variables
    this.points = new Map()
    this.loaded_points = new Map()
    this.min_loaded_index = 0
    this.max_loaded_index = 0
    this.time_offset = 0

    // load file in
    var fs = require('fs');
    var json_contents = fs.readFileSync(lidar_file_path + file_name, 'utf-8');
    const point_data = JSON.parse(json_contents);

    // load points in
    for (var count = 0; count < point_data.points; count++) {
      point_data.set(count, point_data[count.toString()])
    }
    this.reload_points()
  },

  reload_points: function () {
    // unloads all 'old' points
    // then loads all newly 'in timestamp' points
    function minLoadedTimestamp(outer_this) {
      return outer_this.loaded_points.get(outer_this.min_loaded_index)
    }
    function maxLoadedTimestamp(outer_this) {
      return outer_this.loaded_points.get(outer_this.max_loaded_index)
    }

    while(maxLoadedTimestamp(this) < this.time_offset + this.window_size) {
      add_point(this.max_loaded_index + 1)
    }

    while(minLoadedTimestamp(this) < this.time_offset) {
      remove_point(this.min_loaded_index)
    }
  },

  // we assume the point added has the highest index of all points
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
    this.max_loaded_index = point_index
  },

  // we assume the point removed has the lowest index of all points
  remove_point: function (point_index) {
    var point_element = this.loaded_points.get(point_index)
    this.el.removeChild(point_element)
    this.loaded_points.delete(point_index)
    this.min_loaded_index = point_index + 1
  }
});