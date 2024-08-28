<script lang="ts">
    import { T, useFrame } from '@threlte/core';
    import { OrbitControls } from '@threlte/extras';
	import { MathUtils } from 'three';
	    import { writable } from 'svelte/store';

    export let models: any;

    let rotation = writable(0);

    useFrame(() => {
        rotation.update(r => r + 0.01);
    });

    // Add these variables for the sphere position
    let spherePosition = { x: 0, y: 0, z: 0 };

    // Function to update sphere position
    function updateSpherePosition() {
        spherePosition = {
            x: Math.sin($rotation) * 2,
            y: Math.cos($rotation) * 2,
            z: Math.sin($rotation * 0.5) * 2
        };
    }

    // Update sphere position on each frame
    useFrame(() => {
        updateSpherePosition();
    });
</script>

<T.PerspectiveCamera makeDefault position={[10, 10, 10]} fov={24}>
    <OrbitControls enableZoom={true} maxPolarAngle={85 * MathUtils.DEG2RAD} />
</T.PerspectiveCamera>

<T.DirectionalLight position={[3, 10, 10]} />
<T.DirectionalLight position={[-3, 10, -10]} intensity={0.2} />
<T.AmbientLight intensity={0.2} />

<!-- Keep your existing model -->
<T.Group rotation.y={$rotation}>
    {#each models as model}
        <T is={model} />
    {/each}
</T.Group>

<!-- Add the sphere -->
<T.Mesh position={[spherePosition.x, spherePosition.y, spherePosition.z]}>
    <T.SphereGeometry args={[0.5, 32, 32]} />
    <T.MeshStandardMaterial color="#00ff00" />
</T.Mesh>