<script lang="ts">
  import { T, useThrelte,useLoader } from '@threlte/core';
  import { Sky, useTexture, Environment } from '@threlte/extras';
  import Player from './Player.svelte';
  import Floor from './Floor.svelte';
  import { AutoColliders, RigidBody, Debug } from '@threlte/rapier';
  import { Text, Pane } from 'svelte-tweakpane-ui';
	import * as THREE from 'three';

  const {scene} = useThrelte();

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
<T.Group position={[-10, 0, 0]}>
<RigidBody type="fixed">
  <AutoColliders shape={'cuboid'}>
    <T.Mesh receiveShadow>
      <T.BoxGeometry args={[1, 2, 10]} />
      <T.MeshStandardMaterial />
    </T.Mesh>
  </AutoColliders>
</RigidBody>
</T.Group>

<!-- <T.GridHelper args={[100]} position.y={-0.1} /> -->

<!-- <Sky /> -->

<T.Group position={[10, 10, 0]}>
<RigidBody>
  <AutoColliders shape={'cuboid'}>
    <T.Mesh receiveShadow>
      <T.BoxGeometry args={[2, 2, 2]} />
      <T.MeshStandardMaterial />
    </T.Mesh>
  </AutoColliders>
</RigidBody>
</T.Group>

<!-- <T.GridHelper args={[100]} position.y={-0.1} /> -->
<Floor />

<T.Group position={[10, 10, 10]}>
<T.Mesh receiveShadow>
  <T.BoxGeometry args={[2, 2, 2]} />
  <T.MeshStandardMaterial  />
</T.Mesh>
</T.Group>

<!-- <T.GridHelper args={[100]} position.y={-0.1} /> -->
<Floor />
