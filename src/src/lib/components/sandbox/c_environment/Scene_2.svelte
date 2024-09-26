<script lang="ts">
  import { T, useThrelte, useLoader } from '@threlte/core';
  import { GLTF, Environment, useGltf, Outlines} from '@threlte/extras';
  import Player from './Player.svelte';
  import Floor from './Floor.svelte';
  import { AutoColliders, RigidBody, Debug, World, Collider } from '@threlte/rapier';
  import { Text, Pane } from 'svelte-tweakpane-ui';
  import * as THREE from 'three';
  const {scene} = useThrelte();
  
  const shovel = useGltf('/environment/models/shovel.glb');
  const pick = useGltf('/environment/models/low_poly_pickaxe.glb');
  const wall = useLoader(THREE.TextureLoader).load('/environment/textures/Rock032_4K_Color.jpg');
  
  let isHovering = false;

  const handleHover = (hovering:any) => {
  isHovering = hovering;


};
// scene.fog = new THREE.Fog(0x000000, 2, 5); // Change color and parameters as needed

scene.background = new THREE.Color(0x000000);
</script>



  <!-- <Debug /> -->
  <Pane
  position="fixed"
  title="3D Environment Controls"
  x={1300}
  y={80}
  >
  <Text value="Use the 'WASD' keys to move around" disabled />
  <Text value="Press escape 'Esc' to exit the scene" disabled />
  <Text value="Use the mouse to look around" disabled />
  <Text value="Press 'E' to interact with objects" disabled />  
  <Text value="Press to toggle the Torch"disabled />
  </Pane>
  

  <!-- <Environment
    path="/environment/textures/"
    files="Rock032_4K_Color.jpg"
    isBackground={true}

  /> -->
  <Player />

 <T.AmbientLight intensity={0.02} />

  <T.Group scale={1}>
    {#await shovel}
      <slot name="fallback" />
    {:then shovel}
      <RigidBody type="dynamic">
        <!-- AutoColliders with trimesh shape for GLTF -->
        <AutoColliders shape={'trimesh'}>
          <T is={shovel.scenes[0]} scale={0.012} position={[-5, 10, 40]}
          />
        </AutoColliders>
      </RigidBody>
    {:catch error}
      <slot name="error" {error} />
    {/await}
  </T.Group>
  
  <T.Group scale={1} 
>
    {#await pick}
      <slot name="fallback" />
    {:then pick}
      <RigidBody type="dynamic">
        <!-- AutoColliders with trimesh shape for GLTF -->
        <AutoColliders shape={'trimesh'}>
          <T is={pick.scenes[0]} scale={1} position={[2, 3, 15]}
          />
        </AutoColliders>
      </RigidBody>
    {:catch error}
      <slot name="error" {error} />
    {/await}
  </T.Group>

  
  <T.Group position={[10, 25, 26]}>
    <RigidBody type="fixed">
      <AutoColliders shape={'cuboid'}>
        <T.Mesh receiveShadow>
          <T.BoxGeometry args={[1, 100, 50]} />
          {#await wall then value}
          <T.MeshStandardMaterial
          map = {value}
  
      />
      {/await}
        </T.Mesh>
      </AutoColliders>
    </RigidBody>
  </T.Group>


  <T.Group position={[-10, 45, 26]}>
    <RigidBody type="fixed">
      <AutoColliders shape={'cuboid'}>
        <T.Mesh receiveShadow>
          <T.BoxGeometry args={[1, 100, 50]} />
          {#await wall then value}
          <T.MeshStandardMaterial
          map = {value}
      />
      {/await}
        </T.Mesh>
      </AutoColliders>
    </RigidBody>
  </T.Group>


  <T.Group position={[0, 25, 45]}>
    <RigidBody type="fixed">
      <AutoColliders shape={'cuboid'}>
        <T.Mesh receiveShadow > 
          <T.BoxGeometry args={[20, 55, 1]} />
          {#await wall then value}

          <T.MeshStandardMaterial
          map = {value}
      />
      {/await}
        </T.Mesh>
      </AutoColliders>
    </RigidBody>
  </T.Group>


  <T.Group position={[0, 35, 0]}>
    <RigidBody type="fixed">
      <AutoColliders shape={'cuboid'}>
        <T.Mesh receiveShadow > 
          <T.BoxGeometry args={[20, 74, 1]} />
          {#await wall then value}

          <T.MeshStandardMaterial
          map = {value}
      >
      
    </T.MeshStandardMaterial>
      {/await}
        </T.Mesh>
      </AutoColliders>
    </RigidBody>
  </T.Group>
<!-- 
  <T.Group position={[10, 10, 0]}>
    <RigidBody type="dynamic">
      <AutoColliders shape={'cuboid'}>
        <T.Mesh receiveShadow>
          <T.BoxGeometry args={[2, 2, 2]} />
          <T.MeshStandardMaterial />
        </T.Mesh>
      </AutoColliders>
    </RigidBody>
  </T.Group>
  <Floor /> -->
<!-- 
  <T.Group position={[10, 10, 10]}>
    <T.Mesh receiveShadow>
      <T.BoxGeometry args={[2, 2, 2]} />
      <T.MeshStandardMaterial  />
    </T.Mesh>
  </T.Group> -->

  <Floor />