import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
function createControls(camera, canvas) {
    const control = new OrbitControls(camera, canvas);
    control.tick = () => {
        control.update();
    };
    return control;
}
export { createControls };
//# sourceMappingURL=controls.js.map