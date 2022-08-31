import * as THREE from './three';

import { OrbitControls } from './OrbitControls';
import { OBJLoader } from './OBJLoader';

let container;
let camera, scene, renderer, controls;

const obj3d = new THREE.Object3D();
const group = new THREE.Group();

init();
animate();

function init() {
    console.log('init')
    container = document.createElement('div');
    document.body.appendChild(container);

    const width = window.innerWidth;
    const height = window.innerHeight;

    renderer = new THREE.WebGLRenderer();
    renderer.shadowMap.enabled = true;
    // todo - support pixelRatio in this demo
    renderer.setSize(width, height);
    document.body.appendChild(renderer.domElement);

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 8);

    controls = new OrbitControls(camera, renderer.domElement);
    controls.minDistance = 5;
    controls.maxDistance = 20;
    controls.enablePan = false;
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

    //

    scene.add(new THREE.AmbientLight(0xaaaaaa, 0.2));

    const light = new THREE.DirectionalLight(0xddffdd, 0.6);
    light.position.set(1, 1, 1);
    light.castShadow = true;
    light.shadow.mapSize.width = 1024;
    light.shadow.mapSize.height = 1024;

    const d = 10;

    light.shadow.camera.left = - d;
    light.shadow.camera.right = d;
    light.shadow.camera.top = d;
    light.shadow.camera.bottom = - d;
    light.shadow.camera.far = 1000;

    scene.add(light);

    // model

    const loader = new OBJLoader();
    loader.load('./demo_1.obj', function (object) {

        let scale = 1.0;

        object.traverse(function (child) {
            console.log({child})
            if (child instanceof THREE.Mesh) {

                child.geometry.center();
                child.geometry.computeBoundingSphere();
                scale = 0.2 * child.geometry.boundingSphere.radius;

                const phongMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff, specular: 0x111111, shininess: 5 });
                child.material = phongMaterial;
                child.receiveShadow = true;
                child.castShadow = true;
            }
        });

        object.position.y = 1;
        object.scale.divideScalar(scale);
        obj3d.add(object);

    });

    scene.add(group);

    group.add(obj3d);

    const geometry = new THREE.SphereGeometry(3, 48, 24);

    for (let i = 0; i < 20; i++) {
        const material = new THREE.MeshLambertMaterial();
        material.color.setHSL(Math.random(), 1.0, 0.3);

        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.x = Math.random() * 4 - 2;
        mesh.position.y = Math.random() * 4 - 2;
        mesh.position.z = Math.random() * 4 - 2;
        mesh.receiveShadow = true;
        mesh.castShadow = true;
        mesh.scale.multiplyScalar(Math.random() * 0.3 + 0.1);
        group.add(mesh);
    }

    const floorMaterial = new THREE.MeshLambertMaterial({ side: THREE.DoubleSide });

    const floorGeometry = new THREE.PlaneGeometry(12, 12);
    const floorMesh = new THREE.Mesh(floorGeometry, floorMaterial);
    floorMesh.rotation.x -= Math.PI * 0.5;
    floorMesh.position.y -= 1.5;
    group.add(floorMesh);
    floorMesh.receiveShadow = true;

    const torusGeometry = new THREE.TorusGeometry(1, 0.3, 16, 100);
    const torusMaterial = new THREE.MeshPhongMaterial({ color: 0xffaaff });
    const torus = new THREE.Mesh(torusGeometry, torusMaterial);
    torus.position.z = - 4;
    group.add(torus);
    torus.receiveShadow = true;
    torus.castShadow = true;

    window.addEventListener('resize', onWindowResize);

}

function onWindowResize() {
    const width = window.innerWidth;
    const height = window.innerHeight;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    renderer.setSize(width, height);
}

function animate() {
    requestAnimationFrame(animate);

    if (params.rotate) {

        group.rotation.y = timer * 0.0001;

    }

    controls.update();
}