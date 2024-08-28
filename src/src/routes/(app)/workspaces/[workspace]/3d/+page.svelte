<script >
   import { T, useFrame } from '@threlte/core';
    import { OrbitControls, HTML, interactivity } from '@threlte/extras';
    import * as THREE from 'three';

    const geometry = new THREE.BoxGeometry( 1, 1, 1 );
    const material = new THREE.MeshBasicMaterial( { color: 0xffff00 } );
    const mesh = new THREE.Mesh( geometry, material );

    var mouse, raycaster;
    mouse=new THREE.Vector2();
    raycaster= new THREE.Raycaster();
    
    //ormalisationo of mouse coordinates
    function onMouseMove(event){
        mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	    mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

    }


</script>