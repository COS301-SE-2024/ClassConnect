import { writable } from 'svelte/store';
import * as THREE from 'three';

// Store to track sphere position as a THREE.Vector3
export const spherePosition = writable<THREE.Vector3>(new THREE.Vector3());
