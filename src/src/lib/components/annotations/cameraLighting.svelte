<script lang="ts">
    import { onMount } from 'svelte';
    import * as THREE from 'three';

    export let camera;
    export let scene;

    onMount(() => {
        camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 5;

        const ambientLight = new THREE.AmbientLight(0x404040);
        scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
        directionalLight.position.set(1, 1, 1).normalize();
        scene.add(directionalLight);
    });
</script>
