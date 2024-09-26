<script lang="ts">
  import { Group, Vector3 } from 'three'
  import { T, forwardEventHandlers } from '@threlte/core'
  import { useGltf } from '@threlte/extras'
  import { AutoColliders, RigidBody } from '@threlte/rapier'
  
  export const ref = new Group()
  const gltf = useGltf('/environment/models/shovel.glb')
  const component = forwardEventHandlers()

  // Export props for position, scale, and initial velocity

  export let scale: number = 1


  let rigidBody: any
</script>



  <T is={ref} dispose={false} {...$$restProps} bind:this={$component}>
    {#await gltf}
      <slot name="fallback" />
    {:then gltf}
    <T.Group scale={scale}>
      <RigidBody type="dynamic" gravityScale={1}>
        <AutoColliders shape={'trimesh'}>
          <T.Mesh
            geometry={gltf.nodes.Manche_manche_0.geometry}
            material={gltf.materials.manche}
            position={[0, 2.23, 3.57]}
            scale={10}
          />
          <T.Mesh
            geometry={gltf.nodes.Pelle_metal_2_0.geometry}
            material={gltf.materials.metal_2}
            position={[0, 4.2, -5.54]}
            rotation={[0.36, 0, 0]}
            scale={10} 
          />
        </AutoColliders>
      </RigidBody>
    </T.Group>
    {:catch error}
      <slot name="error" {error} />
    {/await}
    <slot {ref} />
  </T>

