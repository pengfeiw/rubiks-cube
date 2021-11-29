import {PerspectiveCamera} from "three";

const createCamera = () => {
    const camera = new PerspectiveCamera(
        35,
        1,
        0.1,
        100
    );

    camera.position.set(0, 0, 30);

    return camera;
};

export default createCamera;
