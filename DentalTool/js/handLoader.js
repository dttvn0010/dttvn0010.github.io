if (!Detector.webgl) Detector.addGetWebGLMessage();

var camera, scene, renderer, mesh;

var data = [
  //set 1.1
  {
    crown : {
      dx:-9.56863,
      dy:13.74088,
      dz:-19.46833,
      rx:0.0462,
      ry:0.22908,
      rz:0.99081,
      model_url: 'data/set1/crown.stl'
    },
    root: {
      dx:-18.948864,
      dy:14.224266,
      dz:15.830048,
      mirrorZ: true,
      model_url: 'data/set1/root.stl'
    }
  },
  //set 1.2
  {
    crown : {
      dx:-8.40914,
      dy:14.5665,
      dz:-19.50226,
      rx:0.06546,
      ry:-0.3288,
      rz:-2.30687,
      model_url: 'data/set1/crown.stl'
    },
    root: {
      dx:-18.948864,
      dy:14.224266,
      dz:15.830048,
      mirrorZ: true,
      model_url: 'data/set1/root.stl'
    }
  },

  //set 2.1
  {
    crown : {
      dx:-13.5375,
      dy:6.82425,
      dz:-18.64405,
      rx:-0.06968,
      ry:0.07714,
      rz:0.7473,
      model_url: 'data/set2/crown.stl'
    },
    root: {
      dx:-25.776840,
      dy:9.337918,
      dz:16.283157,
      mirrorZ: true,
      model_url: 'data/set2/root.stl'
    }
  },

  //set 2.2 			
  {
    crown : {
      dx:-12.00359,
      dy:6.0177,
      dz:-18.64348,
      rx:0.00734,
      ry:-0.15573,
      rz:-2.44717,
      model_url: 'data/set2/crown.stl'
    },
    root: {
      dx:-25.776840,
      dy:9.337918,
      dz:16.283157,
      mirrorZ: true,
      model_url: 'data/set2/root.stl'
    }
  },

  //set3.1
  {
    crown : {
      dx:-8.49686,
      dy:8.10215,
      dz:-20.93944,
      rx:0.08482,
      ry:-0.0181,
      rz:-0.28591,
      model_url: 'data/set3/crown.stl'
    },
    root: {
      dx:-2.046701,
      dy:19.782413,
      dz:17.916336,
      mirrorZ: true,
      model_url: 'data/set3/root.stl'
    }
  },
  // set3.2 		
  {
    crown : {
      dx:-7.93589,
      dy:9.10968,
      dz:-20.98606,
      rx:0.06545,
      ry:-0.07175,
      rz:2.86533,
      model_url: 'data/set3/crown.stl'
    },
    root: {
      dx:-2.046701,
      dy:19.782413,
      dz:17.916336,
      mirrorZ: true,
      model_url: 'data/set3/root.stl'
    }
  },

  //set4.1 	
  {
    crown : {
      dx:-4.44948,
      dy:5.72138,
      dz:-20.48734,
      rx:0.10061,
      ry:-0.12544,
      rz:2.65794,
      model_url: 'data/set4/crown.stl'
    },
    root: {
      dx:-35.259521,
      dy:3.709407,
      dz:12.627400	,
      mirrorZ: true,
      model_url: 'data/set4/root.stl'
    }
  }, 
  
  //set4.2
  {
    crown : {
      dx:-4.49828,
      dy:5.78963,
      dz:-20.54668,
      rx:0.03128,
      ry:0.10968,
      rz:-0.10602,
      model_url: 'data/set4/crown.stl'
    },
    root: {
      dx:-35.259521,
      dy:3.709407,
      dz:12.627400	,
      mirrorZ: true,
      model_url: 'data/set4/root.stl'
    }
  },
  
  //set 5.1
  {
    crown : {
      dx:-8.50759,
      dy:16.12546,
      dz:-20.05471,
      rx:-0.04532,
      ry:0.04051,
      rz:2.38073,
      model_url: 'data/set5/crown.stl'
    },
    root: {
      dx:-6.628056,
      dy:15.763657,
      dz:24.000975,
      mirrorZ: true,
      model_url: 'data/set5/root.stl'
    }
  },
  // set5.2
  {
    crown : {
      dx:-8.26205,
      dy:16.14826,
      dz:-19.96519,
      rx:0.04762,
      ry:0.04756,
      rz:-0.7159,
      model_url: 'data/set5/crown.stl'
    },
    root: {
      dx:-6.628056,
      dy:15.763657,
      dz:24.000975,
      mirrorZ: true,
      model_url: 'data/set5/root.stl'
    }
  },  
]

function getParam(name) {
  if (name = (new RegExp('[?&]' + encodeURIComponent(name) + '=([^&]*)')).exec(location.search))
    return decodeURIComponent(name[1]);
}

loadData(getParam('set_index') || 0).then(_ => {});

function getCenter(vertices) {
  let count = vertices.length / 3;
  let sx = 0.0, sy = 0.0, sz = 0.0;
  for(let i = 0; i < count; i++) {
    sx += vertices[3*i];
    sy += vertices[3*i + 1];
    sz += vertices[3*i + 2];
  }
  return [sx/count, sy/count, sz/count]
}

function rotateX(v, alpha) {
  let sina = Math.sin(alpha);
  let cosa = Math.cos(alpha);
  let [x, y, z] = v;
  return [x, y*cosa - z*sina, y*sina + z*cosa];
}

function rotateY(v, alpha) {
  let sina = Math.sin(alpha);
  let cosa = Math.cos(alpha);
  let [x, y, z] = v;
  return [x*cosa + z*sina, y, -x*sina + z*cosa];
}

function rotateZ(v, alpha) {
  let sina = Math.sin(alpha);
  let cosa = Math.cos(alpha);
  let [x, y, z] = v;
  return [x*cosa - y*sina, x*sina + y*cosa, z];
}

function rotate(v, rx, ry, rz) {
  v = rotateX(v, rx);
  v = rotateY(v, ry);
  return rotateZ(v, rz);
}

function parseBinary(data, dx, dy, dz, rx, ry, rz, mirrorZ){
  var reader = new DataView(data);
  var faces = reader.getUint32( 80, true );    

  var dataOffset = 84;
  var faceLength = 12 * 4 + 2;

  var offset = 0;

  var vertices = new Float32Array( faces * 3 * 3 );
  var normals = new Float32Array( faces * 3 * 3 );

  for (var face = 0; face < faces; face ++ ) {

      var start = dataOffset + face * faceLength;
      var normalX = reader.getFloat32( start, true );
      var normalY = reader.getFloat32( start + 4, true );
      var normalZ = reader.getFloat32( start + 8, true );

      for ( var i = 1; i <= 3; i ++ ) {

          var vertexstart = start + i * 12;

          let x = reader.getFloat32( vertexstart, true ) + dx;
          let y = reader.getFloat32( vertexstart + 4, true ) + dy;
          let z = reader.getFloat32( vertexstart + 8, true ) * (mirrorZ? -1: 1) + dz;

          [x, y, z] = rotate([x, y, z], rx, ry, rz);
          vertices[ offset ] = x;
          vertices[ offset + 1 ] = y;
          vertices[ offset + 2 ] = z + 20;

          normals[ offset ] = normalX ;
          normals[ offset + 1 ] = normalY;
          normals[ offset + 2 ] = normalZ * (mirrorZ? -1: 1);

          offset += 3;

      }
  }

  var geometry = new THREE.BufferGeometry();
  geometry.addAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );
	geometry.addAttribute( 'normal', new THREE.BufferAttribute( normals, 3 ) );

  return geometry;
}

async function loadItem(item, transparent, color) {
  var response = await fetch(item.model_url);
  var buffer = await response.arrayBuffer();
  var geometry = parseBinary(buffer, item.dx, item.dy, item.dz, item.rx || 0, item.ry || 0, item.rz || 0, item.mirrorZ);
  var material = new THREE.MeshPhongMaterial({ color: color, shininess: 200 });
  var mesh = new THREE.Mesh(geometry, material);
  if(item.mirrorZ){
    mesh.material.side = THREE.BackSide;
  }
  
  mesh.material.opacity = transparent;
  mesh.material.transparent = true;
  mesh.position.set(0, 0, 0);
  mesh.rotation.set(0, 0, 0);
  mesh.scale.set(.1, .1, .1);
  
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}

async function loadData(set_index) {

  scene = new THREE.Scene();
  scene.add(new THREE.AmbientLight(0x999999));

  camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 1, 500);

  // Z is up for objects intended to be 3D printed.

  camera.up.set(0, 0, 1);
  camera.position.set(0, 0, 6);

  camera.add(new THREE.PointLight(0xffffff, 0.8));

  scene.add(camera);

  var grid = new THREE.GridHelper(25, 50, 0xffffff, 0x555555);
  grid.rotateOnAxis(new THREE.Vector3(1, 0, 0), 90 * (Math.PI / 180));
  scene.add(grid);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setClearColor(0x999999);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(3*window.innerWidth/4, window.innerHeight);
  //renderer.setSize(window.innerWidth, window.innerHeight);
  document.getElementById('screen').appendChild(renderer.domElement);

  mesh = await loadItem(data[set_index].crown, 0.33, 0x0000ff);
  scene.add(mesh);

  root = await loadItem(data[set_index].root, 1.0, 0xff0000);  
  scene.add(root);

  render();  

  var controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.addEventListener('change', render);
  controls.target.set(0, 1.2, 2);
  controls.update();
  window.addEventListener('resize', onWindowResize, false);
}

function onWindowResize() {

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);

  render();

}

function render() {

  renderer.render(scene, camera);

}
