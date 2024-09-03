<script lang="ts">
    import { onMount } from 'svelte';
    import * as THREE from 'three';
    import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
    import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
    import { DragControls } from 'three/examples/jsm/controls/DragControls.js'; // Import DragControls

    export let data: any;

    let { models } = data;
    console.log('Data: ', models[0].file_path);

    let canvas: HTMLCanvasElement;
    let camera: THREE.PerspectiveCamera, scene: THREE.Scene, renderer: THREE.WebGLRenderer;
    let controls: OrbitControls;
    let dragControls: DragControls;
    let draggableSphere: THREE.Mesh;
    let spherePosition: THREE.Vector3 = new THREE.Vector3();
    // let mouse: THREE.Vector2;
    // let raycaster: THREE.Raycaster;
    // let pins: THREE.Mesh[] = [];

    onMount(() => {
        initScene();
        animate();
    });

    function initScene() {
        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 5;

        renderer = new THREE.WebGLRenderer({ canvas });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setClearColor(0xffffff);

        // raycaster = new THREE.Raycaster();
        // mouse = new THREE.Vector2();

        // Add lighting
        const ambientLight = new THREE.AmbientLight(0x404040); 
        scene.add(ambientLight);
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
        directionalLight.position.set(1, 1, 1).normalize();
        scene.add(directionalLight);

        // Create a draggable sphere
        const sphereGeometry = new THREE.SphereGeometry(0.1);
        const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0x0000FF, transparent: true, opacity: 0.7 });
        draggableSphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
        draggableSphere.position.set(1, 1, 0);
        scene.add(draggableSphere);

        // Initialize OrbitControls
        controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.25;
        controls.enableRotate = true;
        controls.autoRotate = false;
        controls.autoRotateSpeed = 2.0;

        dragControls = new DragControls([draggableSphere], camera, renderer.domElement);
        dragControls.addEventListener('dragstart', () => {
            controls.enabled = false; 
        });
        dragControls.addEventListener('dragend', () => {
            controls.enabled = true; 
            spherePosition.copy(draggableSphere.position);
            console.log('Sphere Position:', spherePosition);
        });

        loadModel();

        window.addEventListener('resize', onWindowResize, false); 
    }

    function loadModel() {
        const loader = new GLTFLoader();
        loader.load(models[0].file_path, (gltf) => {
            scene.add(gltf.scene);
        });
    }

    function animate() {
        requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
    }

    // function placePin(event: MouseEvent) {
    //     mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    //     mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    //     raycaster.setFromCamera(mouse, camera);
    //     const intersects = raycaster.intersectObject(scene.children.find(child => child instanceof THREE.Mesh && child !== draggableSphere));

    //     if (intersects.length > 0) {
    //         const pinGeometry = new THREE.SphereGeometry(0.05);
    //         const pinMaterial = new THREE.MeshBasicMaterial({ color: 0xFF0000 });
    //         const pin = new THREE.Mesh(pinGeometry, pinMaterial);
    //         pin.position.copy(intersects[0].point);
    //         scene.add(pin);
    //         pins.push(pin);
    //         checkProximity(pin);
    //     }
    // }

    // function checkProximity(pin: THREE.Mesh) {
    //     const distance = pin.position.distanceTo(draggableSphere.position);
    //     if (distance <= proximityThreshold) {
    //         console.log('Pin is in the correct vicinity.');
    //     } else {
    //         console.log('Pin is not in the correct vicinity.');
    //     }
    // }

    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }
</script>

<canvas bind:this={canvas}></canvas>

<style>
    canvas {
        width: 100%;
        height: 100%;
    }
</style>
