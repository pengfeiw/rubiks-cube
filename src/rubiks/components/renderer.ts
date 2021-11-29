import {WebGLRenderer} from "three";

const createRenderer = () => {
    const renderer = new WebGLRenderer({antialias: true});
    
    return renderer;
};

export default createRenderer;
