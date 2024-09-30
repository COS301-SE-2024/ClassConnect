import { writable } from 'svelte/store';
import * as THREE from 'three';

export const spherePosition = writable(new THREE.Vector3());
export const selectedModel = writable("");
export const modelSphereData = writable({ file_path: "", position: new THREE.Vector3() });

