<script lang="ts">
    import { onMount } from 'svelte';
    import * as THREE from 'three';
    import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
 
    export let data: any;

	let { models } = data;
    console.log('Data: ', models[0].file_path);
 
    //defines the elements to be used
    //will replace dummy scene with Lungas scene
    let canvas: HTMLCanvasElement;
    let camera: THREE.PerspectiveCamera, scene: THREE.Scene, renderer: THREE.WebGLRenderer, raycaster: THREE.Raycaster, mouse: THREE.Vector2;
    let intersectionPoints: THREE.Vector3[] = [];
    let hotspotSpheres: THREE.Mesh[] = [];
 
    onMount(() => {
        initScene();
    });
 
    function initScene() {
        raycaster = new THREE.Raycaster();
        mouse = new THREE.Vector2();

        window.addEventListener('mousemove', onMouseMove, false);
        window.addEventListener('click', onMouseClick, false);
    }
 
    function loadModel() {
        
        const loader = new GLTFLoader();
        loader.load(models[0].file_path, (gltf) => {
            scene.add(gltf.scene);
        });
    }
 
    function onMouseMove(event: MouseEvent) {//does the normalisation mouse coordinats
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    }
 
    function onMouseClick(event: MouseEvent) {
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(scene.children, true);

    if (intersects.length > 0) {
        const intersectionPoint = intersects[0].point;
        intersectionPoints.push(intersectionPoint);
        console.log('Intersection point:', intersectionPoint);

        const sphereGeometry = new THREE.SphereGeometry(0.1);
        const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000, transparent: true, opacity: 0.5 });
        const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
        sphere.position.copy(intersectionPoint);
        scene.add(sphere);
        hotspotSpheres.push(sphere);

        // Log distance from camera to intersection point
        const distance = camera.position.distanceTo(intersectionPoint);
        console.log('Distance from camera:', distance);

        // Log coordinates relative to the model's center
        const modelCenter = new THREE.Vector3();
        scene.children[0].getWorldPosition(modelCenter);
        const relativeCoordinates = intersectionPoint.sub(modelCenter);
        console.log('Coordinates relative to model center:', relativeCoordinates);
    }
}
 
    function animate() {
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
    }
 </script>
 
 <canvas bind:this={canvas}></canvas>
 
 <style>
    canvas {
        width: 100%;
        height: 100%;
    }
 </style>