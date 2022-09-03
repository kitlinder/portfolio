import * as THREE from 'three';

import { OrbitControls } from 'OrbitControls';
import { OBJLoader } from 'OBJLoader';
/**
 * Models Type:
 * [
 *   {
 *     title: "My part",
 *     filePath: 'demo_1.obj',
 *     scale: 1
 *   }
 * ]
 *  
 */

export const renderModels = (models/** Models Type */) => models.map(({ title, filePath, scale }) => {
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(75, (window.innerWidth*0.8) / (window.innerHeight*0.8));

    var renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth*0.8, window.innerHeight*0.8);
    const titleElement = document.createElement('h1')
    titleElement.innerText = title
    document.body.append(titleElement);
    document.body.append(renderer.domElement);

    renderer.render(scene, camera);

    var controls = new OrbitControls(camera, renderer.domElement);
    controls.minDistance = 10;
    controls.maxDistance = 20;
    controls.enablePan = false;
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

    

    const light = new THREE.AmbientLight()
    scene.add(light)

    let savedObject = { rotation: { x: 0, y: 0, z: 0 } };

    const loader = new OBJLoader();
    loader.load(filePath, function (object) {
        object.traverse(function (child) {
            if (child instanceof THREE.Mesh) {
                child.geometry.center();
                child.geometry.computeBoundingSphere();
                // scale = 0.2 * child.geometry.boundingSphere.radius;
                const normalMaterial = new THREE.MeshNormalMaterial({ opacity: 0.5 });
                child.material = normalMaterial;
                child.receiveShadow = true;
                child.castShadow = true;
            }
        });
        // object.rotation.y = 1
        object.scale.divideScalar(scale);
        savedObject = object
        scene.add(object)
    });

    window.addEventListener('resize', onWindowResize);

    function onWindowResize() {
        const width = window.innerWidth*0.8;
        const height = window.innerHeight*0.8;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
    }

    function animate() {
        savedObject.rotation.z += 0.01
        savedObject.rotation.x += 0.005
        renderer.render(scene, camera);
        requestAnimationFrame(animate);
        controls.update();
    }
    animate();
})