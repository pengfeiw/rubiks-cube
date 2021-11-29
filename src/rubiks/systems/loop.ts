import {PerspectiveCamera, Scene, WebGLRenderer} from 'three';

class Loop {
    public camera: PerspectiveCamera;
    public scene: Scene;
    public renderer: WebGLRenderer;
    public updatables: any[];
    constructor(camera: PerspectiveCamera, scene: Scene, renderer: WebGLRenderer) {
        this.camera = camera;
        this.scene = scene;
        this.renderer = renderer;
        this.updatables = [];
    }

    start() {
        this.renderer.setAnimationLoop(() => {
            this.tick();
            this.renderer.render(this.scene, this.camera);
        });
    }

    stop() {
        this.renderer.setAnimationLoop(null);
    }
    
    tick() {
        for (const object of this.updatables) {
            object.tick();
        }
    }
}

export default Loop;
