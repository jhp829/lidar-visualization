AFRAME.registerComponent('point-cloud-loader', {
  schema: {},

  points: new Map(),
  current_position: { x: 0, y: 0, z: 0 },
  loaded_points: new Map(),
  lidar_file_path: '../lidar_data/',
  view_radius: 10, // in meters

  init: function () {
    this.load_new_file('235.json')
    this.el.addEventListener('new-position', function(position) {
      this.current_position = position
      this.reload_points()
    }, true);
  },

  load_new_file: function (filename) {
    // reset all tracking variables
    this.points = new Map()
    this.loaded_points = new Map()

    fetch(this.lidar_file_path + filename)
    .then(response => {
       return response.json();
    })
    .then(point_data => {
      // load points in
      for (let key in point_data.dataPoints) {
        this.points.set(key, point_data.dataPoints[key])
      }
      this.reload_points()
    })
  },

  reload_points: function () {
    // remove all points
    for (let point_index in this.loaded_points) {
      this.remove_point(point_index)
    }

    var outer_this = this
    function add_square(x, y) {
      var square_key = x.toString() + "," + y.toString()
      for(point_index in outer_this.points.get(square_key)) {
        outer_this.add_point(point_index, square_key)
      }
    }

    for( x = -this.view_radius; x < this.view_radius; x++) {
      for ( y = -this.view_radius; y < this.view_radius; y++) {
        add_square(x, y)
      }
    }
  },

  // we assume the point added has the highest index of all points
  add_point: function (point_index, square_key) {
    var point = this.points.get(square_key)[point_index]

    // create point element
    var point_element = document.createElement('a-box');

    // set attributes
    var position = { x: point.x, y: point.y, z: point.z }
    point_element.setAttribute('position', position);
    point_element.setAttribute('scale', { x: 0.05, y: 0.05, z: 0.05 });
    point_element.setAttribute('color', '#F5E942');

    // append it to the scene
    this.el.appendChild(point_element)

    // add it to the list of loaded points so it can be easily removed later
    this.loaded_points.set(point_index, point_element)
  },

  // // we assume the point added has the highest index of all points
  // add_point: function (point_index) {
  //   var point = this.points.get(point_index)

  //   // create point element
  //   var point_element = document.createElement('a-box');

  //   // set attributes
  //   var position = { x: point.x, y: point.y, z: point.z }
  //   point_element.setAttribute('position', position);
  //   point_element.setAttribute('scale', { x: 0.05, y: 0.05, z: 0.05 });
  //   point_element.setAttribute('color', '#F5E942');

  //   // append it to the scene
  //   this.el.appendChild(point_element)

  //   // add it to the list of loaded points so it can be easily removed later
  //   this.loaded_points.set(point_index, point_element)
  //   this.max_loaded_index = point_index
  // },

  // we assume the point removed has the lowest index of all points
  remove_point: function (point_index) {
    var point_element = this.loaded_points.get(point_index)
    this.el.removeChild(point_element)
    this.loaded_points.delete(point_index)
  }
});