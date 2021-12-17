import {PerspectiveCamera, Scene, WebGLRenderer} from "three";
import createCamera from "./components/camera";
import createScene from "./components/scene";
import createRenderer from "./components/renderer";
import {Cube} from "./core/cube";
import Control from "./core/control";

const setSize = (container: Element, camera: PerspectiveCamera, renderer: WebGLRenderer) => {
    // Set the camera's aspect ratio
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();

    // update the size of the renderer AND the canvas
    renderer.setSize(container.clientWidth, container.clientHeight);

    // set the pixel ratio (for mobile devices)
    renderer.setPixelRatio(window.devicePixelRatio);
};

class Rubiks {
    private camera: PerspectiveCamera;
    private scene: Scene;
    private renderer: WebGLRenderer;
    private _control: Control | undefined;
    public constructor(container: Element) {
        this.camera = createCamera();
        this.scene = createScene("black");
        this.renderer = createRenderer();
        container.appendChild(this.renderer.domElement);
        
        // auto resize
        window.addEventListener("resize", () => {
            setSize(container, this.camera, this.renderer);
            this.render();
        });
        setSize(container, this.camera, this.renderer);
        this.setOrder(3);
    }

    public setOrder(order: number) {
        this.scene.remove(...this.scene.children);
        if (this._control) {
            this._control.dispose();
        }

        const cube = new Cube(order);
        this.scene.add(cube);
        this._control = new Control(this.camera, this.scene, this.renderer, cube);
        this.render();
    }

    private render() {
        this.renderer.render(this.scene, this.camera);
    }
}

export default Rubiks;
