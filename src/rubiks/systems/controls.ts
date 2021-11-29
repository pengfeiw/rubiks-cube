import {Camera} from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';

function createControls(camera: Camera, canvas: HTMLElement) {
    const control = new OrbitControls(camera, canvas);
    (control as any).tick = () => {
        control.update();
    }

    return control;
}

export {createControls};
