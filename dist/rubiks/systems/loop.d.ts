import { PerspectiveCamera, Scene, WebGLRenderer } from 'three';
declare class Loop {
    camera: PerspectiveCamera;
    scene: Scene;
    renderer: WebGLRenderer;
    updatables: any[];
    constructor(camera: PerspectiveCamera, scene: Scene, renderer: WebGLRenderer);
    start(): void;
    stop(): void;
    tick(): void;
}
export default Loop;
