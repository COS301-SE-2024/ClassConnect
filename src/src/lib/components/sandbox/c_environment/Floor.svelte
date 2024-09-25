<script lang="ts">
    import { T, useLoader} from '@threlte/core'
    import { AutoColliders } from '@threlte/rapier'
    import { TextureLoader } from 'three';
    

    const floorTexture = useLoader(TextureLoader).load('/environment/textures/coral_fort_wall_02_diff_4k.jpg');
    $: console.log(floorTexture)
  </script>
 

  <T.Group position={[0, -1, 0]}>
    <AutoColliders shape={'cuboid'}>
      <T.Mesh receiveShadow>
        <T.BoxGeometry args={[100, 1, 100]} />
        {#await floorTexture then value}
        <T.MeshStandardMaterial
        map = {value}

    />
    {/await}
      </T.Mesh>
    </AutoColliders>
  </T.Group>
