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

export const renderModels = (models/** Models Type */) => models.map(({ title, filePath }) => {
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight);

    var renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
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

    animate();

    const width = window.innerWidth;
    const height = window.innerHeight;

    const light = new THREE.AmbientLight()
    scene.add(light)

    const loader = new OBJLoader();
    loader.load(filePath, function (object) {
        console.log('loading')
        let scale = 10;
        object.traverse(function (child) {
            if (child instanceof THREE.Mesh) {
                child.geometry.center();
                child.geometry.computeBoundingSphere();
                // scale = 0.2 * child.geometry.boundingSphere.radius;
                const normalMaterial = new THREE.MeshNormalMaterial({ color: 0xff0000, opacity: 0.5 });
                child.material = normalMaterial;
                child.receiveShadow = true;
                child.castShadow = true;
            }
        });

        object.scale.divideScalar(scale);

        scene.add(object)
    });

    window.addEventListener('resize', onWindowResize);

    function onWindowResize() {
        const width = window.innerWidth;
        const height = window.innerHeight;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
    }

    function animate() {
        renderer.render(scene, camera);
        requestAnimationFrame(animate);
        controls.update();
    }
})