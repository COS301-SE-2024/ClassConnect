<script lang="ts">
    import { T } from "@threlte/core";
    import {OrbitControls, Sky, GLTF } from "@threlte/extras";
    import CashRegister from "./models/Cash_Register.svelte";


//Max Zoom Out
const maxZoomOutDistance = 100;

    export let autoRotate: boolean
    export let enableDamping: boolean
    export let rotateSpeed: number
    export let zoomToCursor: boolean
    export let zoomSpeed: number
    export let enableZoom: boolean

</script>

<T.PerspectiveCamera makeDefault position={[0,0,-45]}
fov={75}
>
    <OrbitControls
    {enableDamping}
    {autoRotate}
    {rotateSpeed}
    {zoomToCursor}
    {zoomSpeed}
    {enableZoom}
    maxDistance={maxZoomOutDistance}
  />
</T.PerspectiveCamera>


<!-- Add ambient light for base illumination -->
<T.AmbientLight intensity={0.9} />

<!-- Add multiple point lights for even lighting -->
<T.PointLight position={[0, 10, 10]} intensity={0.5} />
<T.PointLight position={[0, -10, 10]} intensity={0.5} />
<T.PointLight position={[10, 10, 0]} intensity={0.5} />
<T.PointLight position={[-10, -10, 0]} intensity={0.5} />
<T.PointLight position={[0, -10, -10]} intensity={0.5} />
<T.PointLight position={[0, 0, -10]} intensity={0.5} />


<!-- Add a directional light to simulate sunlight -->
<T.DirectionalLight position={[5, 10, 7]} intensity={0.8} castShadow />

<T.Mesh position.y={1}>
    <T.BoxGeometry args={[1, 2, 1]} />
    <T.MeshBasicMaterial color="red" />
</T.Mesh>

<GLTF url="/models/cash_register_with_a_counting_machine.glb"
<!-- scale={0.05}/> -->


<Sky/>
<!-- <CashRegister></CashRegister> -->



