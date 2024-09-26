<script lang="ts">
  import { T, useThrelte, useLoader } from '@threlte/core';
  import { GLTF, Environment, useGltf} from '@threlte/extras';
  import Player from './Player.svelte';
  import Floor from './Floor.svelte';
  import { AutoColliders, RigidBody, Debug, World, Collider } from '@threlte/rapier';
  import { Text, Pane } from 'svelte-tweakpane-ui';
  import * as THREE from 'three';
  const {scene} = useThrelte();
  
  const shovel = useGltf('/environment/models/shovel.glb');
  const pick = useGltf('/environment/models/low_poly_pickaxe.glb');
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
  </Pane>
  <Environment
    path="/environment/textures/"
    files="Rock032_4K_Color.jpg"
    isBackground={true}
  />
  <Player />
  <T.AmbientLight intensity={0.5} />


  <T.Group scale={1}>
    {#await shovel}
      <slot name="fallback" />
    {:then shovel}
      <RigidBody type="dynamic">
        <!-- AutoColliders with trimesh shape for GLTF -->
        <AutoColliders shape={'trimesh'}>
          <T is={shovel.scenes[0]} scale={0.012} position={[0, 10, 0]}
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
          <T is={pick.scenes[0]} scale={1} position={[2, 3, 0]}
          />
        </AutoColliders>
      </RigidBody>
    {:catch error}
      <slot name="error" {error} />
    {/await}
  </T.Group>

<!--   
  <T.Group position={[-10, 0, 0]}>
    <RigidBody type="fixed">
      <AutoColliders shape={'cuboid'}>
        <T.Mesh receiveShadow>
          <T.BoxGeometry args={[1, 2, 10]} />
          <T.MeshStandardMaterial />
        </T.Mesh>
      </AutoColliders>
    </RigidBody>
  </T.Group> -->
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