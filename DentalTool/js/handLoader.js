if (!Detector.webgl) Detector.addGetWebGLMessage();

var camera, scene, renderer, mesh;

init().then(_ => {});

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

async function loadData(url, dx, dy, dz, rx, ry, rz, mirrorZ, transparent, color) {
  var response = await fetch(url);
  var buffer = await response.arrayBuffer();
  var geometry = parseBinary(buffer, dx, dy, dz, rx, ry, rz, mirrorZ);
  var material = new THREE.MeshPhongMaterial({ color: color, shininess: 200 });
  var mesh = new THREE.Mesh(geometry, material);
  if(mirrorZ){
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

async function init() {

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

  mesh = await loadData('models/crown.stl', -9.10248+0.055953123, 13.9334955-0.16476549, -22.370579+1.913591, 0.042853773,0.21263692,0.99660957, false, 0.25, 0x0000ff);
  scene.add(mesh);

  root = await loadData('models/root.stl', -18.845896, 14.533778, 14.751112, 0, 0, 0, true, 1.0, 0xff0000);  
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
