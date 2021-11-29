import {Color, Scene, ColorRepresentation} from "three";

const createScene = (bgColor: ColorRepresentation) => {
    const scene = new Scene();

    scene.background = new Color(bgColor);

    return scene;
};

export default createScene;
