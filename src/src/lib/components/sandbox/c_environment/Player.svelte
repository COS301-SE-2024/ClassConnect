<script lang="ts">
  import { T, useThrelte, useTask } from '@threlte/core';
  import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';
  import { PerspectiveCamera, Vector3 } from 'three';
  import * as THREE from 'three';
  import { onDestroy, onMount } from 'svelte';
  import { CollisionGroups, Collider, RigidBody } from '@threlte/rapier';
  import type { RigidBody as RapierRigidBody } from '@dimforge/rapier3d-compat';

  const t = new Vector3();
  let controls: PointerLockControls;
  export let position: [x: number, y: number, z: number] = [0, 0, 0];

  let radius = 0.3;
  let height = 1.8;
  let speed: number = 6;

  let forward = 0;
  let backward = 0;
  let left = 0;
  let right = 0;

  let rigidBody: RapierRigidBody;

  const { renderer, scene } = useThrelte();
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();

  function onMouseMove(event: MouseEvent) {
      pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
      pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
  }

  function onKeyDown(e: KeyboardEvent) {
      if (!controls.isLocked) return;
      switch (e.key) {
          case 's':
              backward = 2;
              break;
          case 'w':
              forward = 2;
              break;
          case 'a':
              left = 2;
              break;
          case 'd':
              right = 2;
              break;
          default:
              break;
      }
  }

  function onKeyUp(e: KeyboardEvent) {
      switch (e.key) {
          case 's':
              backward = 0;
              break;
          case 'w':
              forward = 0;
              break;
          case 'a':
              left = 0;
              break;
          case 'd':
              right = 0;
              break;
          default:
              break;
      }
  }

  onMount(() => {
      controls = new PointerLockControls(cam, renderer.domElement);

      renderer.domElement.addEventListener('click', () => {
          controls.lock();
      });
      window.addEventListener('keydown', onKeyDown);
      window.addEventListener('keyup', onKeyUp);
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mousemove', (event) => {
    console.log(pointer); // Ensure the pointer values are correct
})

      controls.addEventListener('unlock', () => {});
  });

  onDestroy(() => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
  });

  useTask(() => {
    if (controls.isLocked) {
        // Center the raycaster
        pointer.x = 0;
        pointer.y = 0;

        // Set up the raycaster
        raycaster.setFromCamera(pointer, cam);

        const intersects = raycaster.intersectObjects(scene.children, true);

        if (intersects.length > 0) {
            const firstObject = intersects.find(intersect => intersect.object instanceof THREE.Mesh);
            
            if (firstObject) {
                const mesh = firstObject.object as THREE.Mesh;

                // Store the original color
                if (!mesh.userData.originalColor) {
                    mesh.userData.originalColor = (mesh.material as THREE.MeshStandardMaterial).color.getHex();
                }

                // Highlight the object
                if (mesh.material instanceof THREE.MeshStandardMaterial) {
                    mesh.material.color.set(0xff0000); // Change to red
                }

                // Timeout to revert back to the original color after some time
                setTimeout(() => {
                    (mesh.material as THREE.MeshStandardMaterial).color.setHex(mesh.userData.originalColor);
                }, 1000); // Revert after 1 second
            }
        }
    }
});

  let cam: PerspectiveCamera;

  useTask(() => {
      if (!rigidBody) return;
      const velVec = t.fromArray([right - left, 0, backward - forward]);
      velVec.applyEuler(cam.rotation).multiplyScalar(speed);
      const linVel = rigidBody.linvel();
      t.y = linVel.y;
      rigidBody.setLinvel(t, true);

      const pos = rigidBody.translation();
      position = [pos.x, pos.y, pos.z];
  });
</script>

<svelte:window
  on:keydown|preventDefault={onKeyDown}
  on:keyup={onKeyUp}
/>

<T.Group position.y={0.9}>
  <T.PerspectiveCamera
      makeDefault
      fov={90}
      bind:ref={cam}
      position.x={position[0]}
      position.y={position[1]}
      position.z={position[2]}
      on:create={({ ref }) => {
          ref.lookAt(new Vector3(1, 0.5, 0));
      }}
  />
</T.Group>

<T.Group {position}>
  <RigidBody
      bind:rigidBody
      enabledRotations={[false, false, false]}
  >
      <CollisionGroups groups={[0]}>
          <Collider
              shape={'capsule'}
              args={[height / 2 - radius, radius]}
          />
      </CollisionGroups>

      <CollisionGroups groups={[15]}>
          <T.Group position={[0, -height / 2 + radius, 0]}>
              <Collider
                  sensor
                  shape={'ball'}
                  args={[radius * 1.2]}
              />
          </T.Group>
      </CollisionGroups>
  </RigidBody>
</T.Group>
