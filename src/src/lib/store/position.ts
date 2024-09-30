import { writable } from 'svelte/store';
import * as THREE from 'three';

export const spherePosition = writable<THREE.Vector3>(new THREE.Vector3());
