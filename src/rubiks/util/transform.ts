import {Matrix4, Object3D, Vector3} from "three";

export const rotateAroundWorldAxis = (object: Object3D, axis: Vector3, radians: number) => {
    const mat = new Matrix4();
    mat.makeRotationAxis(axis.normalize(), radians);

    mat.multiply(object.matrix);

    object.matrix = mat;

    object.rotation.setFromRotationMatrix(object.matrix);
};

export const ndcToScreen = (ndc: {x: number; y: number}, winW: number, winH: number) => {
    const halfW = winW * 0.5;
    const halfH = winH * 0.5;

    const x = (ndc.x * halfW) + halfW;
    const y = halfH - (ndc.y * halfH);

    return {x, y};
};
