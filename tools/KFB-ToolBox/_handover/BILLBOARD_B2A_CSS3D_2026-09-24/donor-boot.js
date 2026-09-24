// B2a SOURCE-ISOLATION PROOF.
// Donor: mrdoob/three.js r160 examples/css3d_youtube.html
// Commit: d04539a76736ff500cae883d6a38b3dd8643c548
// This file intentionally keeps the donor's CSS3DRenderer + CSS3DObject + iframe +
// TrackballControls blocker pattern before any KFB billboard integration.

import * as THREE from 'three';
import { TrackballControls } from 'three/addons/controls/TrackballControls.js';
import { CSS3DRenderer, CSS3DObject } from 'three/addons/renderers/CSS3DRenderer.js';

const VIDEO_ID = 'MTCSwppblk0';
const WIDTH = 640;
const HEIGHT = 360;

let camera, scene, renderer, controls, object, iframe;

function Element(id, x, y, z, ry) {
  const div = document.createElement('div');
  div.style.width = WIDTH + 'px';
  div.style.height = HEIGHT + 'px';
  div.style.backgroundColor = '#000';

  iframe = document.createElement('iframe');
  iframe.style.width = WIDTH + 'px';
  iframe.style.height = HEIGHT + 'px';
  iframe.style.border = '0px';
  iframe.title = 'YouTube donor proof';
  iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; picture-in-picture';
  iframe.setAttribute('allowfullscreen', '');
  iframe.src = 'https://www.youtube-nocookie.com/embed/' + id + '?rel=0&modestbranding=1&playsinline=1';
  div.appendChild(iframe);

  const cssObject = new CSS3DObject(div);
  cssObject.position.set(x, y, z);
  cssObject.rotation.y = ry;
  return cssObject;
}

function init() {
  const container = document.getElementById('container');
  camera = new THREE.PerspectiveCamera(50, innerWidth / innerHeight, 1, 5000);
  camera.position.set(0, 0, 760);

  scene = new THREE.Scene();
  object = Element(VIDEO_ID, 0, 0, 0, 0);
  scene.add(object);

  renderer = new CSS3DRenderer();
  renderer.setSize(innerWidth, innerHeight);
  container.appendChild(renderer.domElement);

  controls = new TrackballControls(camera, renderer.domElement);
  controls.rotateSpeed = 4;

  const blocker = document.getElementById('blocker');
  controls.addEventListener('start', () => { blocker.style.display = ''; });
  controls.addEventListener('end', () => { blocker.style.display = 'none'; });

  addEventListener('resize', () => {
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(innerWidth, innerHeight);
  });

  window.__B2A_DONOR = {
    ready: true,
    donor: 'mrdoob/three.js@d04539a76736ff500cae883d6a38b3dd8643c548/examples/css3d_youtube.html',
    runtime: 'three@0.160.0',
    pattern: 'CSS3DRenderer + CSS3DObject + iframe + drag blocker',
    videoId: VIDEO_ID,
    iframeSrc: iframe.src,
    objectCount: scene.children.length,
    size: [WIDTH, HEIGHT]
  };
  console.info('[B2a donor]', window.__B2A_DONOR);
}

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}

init();
animate();
