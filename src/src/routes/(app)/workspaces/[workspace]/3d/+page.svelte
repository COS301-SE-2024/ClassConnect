<script lang="ts">
    import { onMount } from 'svelte';
    import * as THREE from 'three';
    import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
 
    export let data: any;

	let { models } = data;
 
    let canvas: HTMLCanvasElement;
    let camera: THREE.PerspectiveCamera, scene: THREE.Scene, renderer: THREE.WebGLRenderer, raycaster: THREE.Raycaster, mouse: THREE.Vector2;
    let intersectionPoints: THREE.Vector3[] = [];
 
    onMount(() => {
        initScene();
        loadModel();
        animate();
 
        window.addEventListener('mousemove', onMouseMove, false);
        window.addEventListener('click', onMouseClick, false);
    });
 
    function initScene() {
        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 5;
 
        renderer = new THREE.WebGLRenderer({ canvas });
        renderer.setSize(window.innerWidth, window.innerHeight);
 
        raycaster = new THREE.Raycaster();
        mouse = new THREE.Vector2();
    }
 
    function loadModel() {
        const loader = new GLTFLoader();
        loader.load(models.file_path, (gltf) => {
            scene.add(gltf.scene);
        });
    }
 
    function onMouseMove(event: MouseEvent) {
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
 
            // Visualize the selected point
            const sphereGeometry = new THREE.SphereGeometry(0.05);
            const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
            const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
            sphere.position.copy(intersectionPoint);
            scene.add(sphere);
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