AFRAME.registerComponent('point-cloud-loader', {
  schema: {},

  points: new Map(),
  current_position: { x: 0, y: 1.5, z: 0 },
  loaded_points: new Map(),
  lidar_file_path: '../lidar_data/',
  view_radius: 15, // in meters
  merger_el: null,
  camera_el: null,
  density: 0.2,
  current_scene_index: 0,

  init: function () {
    this.merger_el = document.querySelector('#merger')
    this.camera_el = document.querySelector('#cameraRig')
    this.load_new_file('315.json')
    this.el.addEventListener('ybuttonup', () => {
      var positionVec = this.camera_el.getAttribute("position")
      this.current_position = {
        x: positionVec.x,
        y: positionVec.y, 
        z: positionVec.z  
      }
      this.reload_points()
    }, true);
    this.el.addEventListener('abuttonup', () => {
      this.density += 0.025
    }, true);
    this.el.addEventListener('bbuttonup', () => {
      this.density -= 0.025
    }, true);
    this.el.addEventListener('click', () => {
      this.current_scene_index += 1
      this.current_scene_index = this.current_scene_index % 6
      var scenes = ["235.json", "245.json", "255.json", "265.json", "275.json", "285.json"]
      this.load_new_file(scenes[this.current_scene_index])
    })
    // this.el.addEventListener('abuttonup', () => {
    //   this.density += 0.025
    // }, true);
    // this.el.addEventListener('bbuttonup', () => {
    //   this.density -= 0.025
    // }, true);
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
        if (Math.random() < outer_this.density) {
          outer_this.add_point(point_index, square_key)
        } 
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
    var distance = Math.sqrt(point.x*point.x + point.z*point.z)
    var colorScale = parseInt(255 - ((145/(this.view_radius * 1.42)) * distance)).toString(16)
    point_element.setAttribute('position', position);
    point_element.setAttribute('geometry', {buffer: true, primitive: 'box'})
    point_element.setAttribute('scale', { x: 0.05, y: 0.05, z: 0.05 });
    point_element.setAttribute('color', '#' + colorScale + '6E' + 'FF');

    // append it to the scene
    this.merger_el.appendChild(point_element)

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
    this.merger_el.removeChild(point_element)
    this.loaded_points.delete(point_index)
  }
});