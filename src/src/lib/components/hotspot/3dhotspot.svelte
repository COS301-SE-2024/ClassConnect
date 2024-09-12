<script lang="ts">
    import { onMount } from 'svelte';
    import * as THREE from 'three';
    import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
    import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
    import { DragControls } from 'three/examples/jsm/controls/DragControls.js'; // Import DragControls
    
    export let data: any;
    
    let { models } = data;
    console.log('Role: ', data.role);
    
    console.log('file path', data.materials[0]);
    let canvas: HTMLCanvasElement;
    let camera: THREE.PerspectiveCamera, scene: THREE.Scene, renderer: THREE.WebGLRenderer;
    let controls: OrbitControls;
    let dragControls: DragControls;
    let draggableSphere: THREE.Mesh;
    let spherePosition: THREE.Vector3 = new THREE.Vector3();
    let pinPos:THREE.Vector3 = new THREE.Vector3();
    let mouse: THREE.Vector2;
    let raycaster: THREE.Raycaster;
    let loadedModel: THREE.Object3D | undefined;
    let currentPin: THREE.Mesh | null = null;

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

        raycaster = new THREE.Raycaster();
        mouse = new THREE.Vector2();

        // Add lighting
        const ambientLight = new THREE.AmbientLight(0x404040); 
        scene.add(ambientLight);
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
        directionalLight.position.set(1, 1, 1).normalize();
        scene.add(directionalLight);

       
        if(data.role === 'lecturer'){
            // Create a draggable sphere
            const sphereGeometry = new THREE.SphereGeometry(0.1);
            const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0x0000FF, transparent: true, opacity: 0.7 });
            draggableSphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
            draggableSphere.position.set(1, 1, 0);
            scene.add(draggableSphere);

            //sphere drag
            dragControls = new DragControls([draggableSphere], camera, renderer.domElement);
            dragControls.addEventListener('dragstart', () => {
                controls.enabled = false; 
            });
            dragControls.addEventListener('dragend', () => {
                controls.enabled = true; 
                spherePosition.copy(draggableSphere.position);
                console.log('Sphere Position:', spherePosition);
                localStorage.setItem('spherePosition', JSON.stringify(draggableSphere.position.toArray()));
            });
        }

        else if(data.role==='student'){
            // Create and add the new pin
            const pinGeometry = new THREE.SphereGeometry(0.05);
            const pinMaterial = new THREE.MeshBasicMaterial({ color: 0xFF0000 });
            const pin = new THREE.Mesh(pinGeometry, pinMaterial);
            
            pin.position.set(0, 1, 0);
            scene.add(pin);
            
            const pinDragControls = new DragControls([pin], camera, renderer.domElement);
            pinDragControls.addEventListener('dragstart', () => {
                controls.enabled = false;
            });
            pinDragControls.addEventListener('dragend', () => {
                controls.enabled = true;
                pinPos.copy(pin.position);
                console.log('Pin placed at', pin.position);  
                checkProximity(pin);
            });
    }
    

        // Initialize OrbitControls
        controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.25;
        controls.enableRotate = true;
        controls.autoRotate = false;
        controls.autoRotateSpeed = 2.0;


        loadModel();

        window.addEventListener('resize', onWindowResize, false); 
    }

    function loadModel() {
        const loader = new GLTFLoader();
        loader.load(data.materials[0].file_path, (gltf) => {
            loadedModel = gltf.scene;
            scene.add(loadedModel);
        });
    }

    function animate() {
        requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
    }

    function getSavedSpherePosition(): THREE.Vector3 {
        const savedPosition = localStorage.getItem('spherePosition');
        if (savedPosition) {
            const [x, y, z] = JSON.parse(savedPosition);
            return new THREE.Vector3(x, y, z);
        }
        return new THREE.Vector3(); 
}


    function checkProximity(pin: THREE.Mesh) {
        const savedSpherePosition = getSavedSpherePosition();
        const distance = pin.position.distanceTo(savedSpherePosition);
        if (distance <= 0.2) {
            alert('Pin is in the correct vicinity.');
        } else {
            console.log('Pin is not in the correct vicinity.');
        }
    }

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
        height: calc(100vh / 4);   
        max-width: 100%;           
        object-fit: contain;       
    }

</style>
