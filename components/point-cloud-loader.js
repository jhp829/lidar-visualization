AFRAME.registerComponent('point-cloud-loader', {
  schema: {},

  points: new Map(),
  min_loaded_index: 0,
  max_loaded_index: 0,
  loaded_points: new Map(),
  lidar_file_path: '../lidar_data/',
  time_offset: 0,
  window_size: 1000, // in milliseconds

  init: function () {
    this.load_new_file('235.json')
    this.el.addEventListener('abuttonup', function() {
      this.time_offset += 200
    });
  },

  load_new_file: function (filename) {
    // reset all tracking variables
    this.points = new Map()
    this.loaded_points = new Map()
    this.min_loaded_index = 0
    this.max_loaded_index = 0
    this.time_offset = 0

    fetch(this.lidar_file_path + filename)
    .then(response => {
       return response.json();
    })
    .then(point_data => {
      console.log(point_data)
      console.log(typeof(point_data))
      // load points in
      for (let key in point_data.dataPoints) {
        this.points.set(parseInt(key), point_data.dataPoints[key])
      }
      console.log(this.points)
      this.reload_points()
    })
  },

  reload_points: function () {
    // unloads all 'old' points
    // then loads all newly 'in timestamp' points
    function minLoadedTimestamp(outer_this) {
      if (outer_this.loaded_points.size == 0) {
        return 100000000000
      }
      return outer_this.points.get(outer_this.min_loaded_index).timestamp
    }
    function maxLoadedTimestamp(outer_this) {
      if (outer_this.loaded_points.size == 0) {
        return 0
      }
      return outer_this.points.get(outer_this.max_loaded_index).timestamp
    }

    while(maxLoadedTimestamp(this) < this.time_offset + this.window_size) {
      this.add_point(this.max_loaded_index + 1)
    }

    while(minLoadedTimestamp(this) < this.time_offset) {
      this.remove_point(this.min_loaded_index)
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