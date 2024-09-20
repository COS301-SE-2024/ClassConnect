<script lang="ts">
    import { T  } from '@threlte/core';
    import {  Sky } from '@threlte/extras';
    import Player from './Player.svelte'
    import Floor from './Floor.svelte'
    import { AutoColliders, RigidBody,Debug } from '@threlte/rapier';
  </script>
  <Debug/>
  <Player/>
  
  <T.Group position={[-10, 0, 0]}>
    <RigidBody
    type="fixed">
    <AutoColliders shape={'cuboid'}>
      <T.Mesh receiveShadow>
        <T.BoxGeometry args={[1, 2,10]} />
        <T.MeshStandardMaterial />
      </T.Mesh>
    </AutoColliders>
  </RigidBody>
  </T.Group>
  <T.GridHelper args={[100]} position.y={-0.1} />
  
  <Sky/>
  <T.Group position={[10, 10, 0]}>
    <RigidBody>
    <AutoColliders shape={'cuboid'}>
      <T.Mesh receiveShadow>
        <T.BoxGeometry args={[2, 2,2]} />
        <T.MeshStandardMaterial />
      </T.Mesh>
    </AutoColliders>
  </RigidBody>
  </T.Group>
  <T.GridHelper args={[100]} position.y={-0.1} />
  <Floor/>
  