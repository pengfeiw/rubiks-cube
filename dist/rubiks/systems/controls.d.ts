import { Camera } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
declare function createControls(camera: Camera, canvas: HTMLElement): OrbitControls;
export { createControls };
