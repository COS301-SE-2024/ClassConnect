<script>
    import { T } from "@threlte/core";
    import {OrbitControls, Sky, GLTF } from "@threlte/extras";
	import { AmbientLight, AxesHelper, DirectionalLight, Mesh, MeshStandardMaterial, PerspectiveCamera, SphereGeometry } from "three";
    import CashRegister from "./models/Cash_Register.svelte"


	// import { GridHelper } from "three";
	// import { MeshStandardMaterial, PerspectiveCamera, SphereGeometry } from "three";
	// import { metalness, roughness } from "three/examples/jsm/nodes/Nodes.js";

</script>

<T.PerspectiveCamera makeDefault position={[0,7,-45]}>
    <OrbitControls enableDamping={true}/>
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




<GLTF url="/models/cash_register_with_a_counting_machine.glb"
scale={0.1}/>


<Sky/>
<!-- <CashRegister></CashRegister> -->



