class Loop {
    constructor(camera, scene, renderer) {
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
//# sourceMappingURL=loop.js.map