import {Color, Mesh, PerspectiveCamera, Raycaster, Scene, Vector2, Vector3, WebGLRenderer} from "three";
import {Cube} from "./cube";
import {rotateAroundWorldAxis} from "../util/transform";
import {SquareMesh} from "./square";

class Control {
    private renderer: WebGLRenderer;
    private scene: Scene;
    private cube: Cube;
    private camera: PerspectiveCamera;
    private mouseDown = false;
    private get domElement() {
        return this.renderer.domElement;
    }
    private raycaster = new Raycaster();
    public constructor(camera: PerspectiveCamera, scene: Scene, renderer: WebGLRenderer, cube: Cube) {
        this.cube = cube;
        this.renderer = renderer;
        this.scene = scene;
        this.camera = camera;

        this.init();
    }

    private init() {
        this.domElement.addEventListener("mousedown", this.mouseDownHandle.bind(this));
        this.domElement.addEventListener("mouseup", this.mouseUpHandle.bind(this));
        this.domElement.addEventListener("mousemove", this.mouseMoveHandle.bind(this));
    }

    public mouseDownHandle(event: MouseEvent) {
        this.mouseDown = true;

        // // 测试：Raycaster
        // const x = (event.offsetX / this.domElement.width) * 2 - 1;
        // const y = -(event.offsetY / this.domElement.height) * 2 + 1;

        // this.raycaster.setFromCamera({x, y}, this.camera);

        // const intersects = this.raycaster.intersectObjects(this.cube.squares);

        // if (intersects.length > 0) {
        //     intersects.sort((item) => item.distance);
        //     (intersects[0].object as SquareMesh).material.color = new Color(Math.random() * 0xFFFFFF);

        //     console.log((intersects[0].object as SquareMesh).element.pos);
        //     this.renderer.render(this.scene, this.camera);
        // }
    }

    public mouseUpHandle() {
        this.mouseDown = false;
    }

    public mouseMoveHandle(event: MouseEvent) {
        if (this.mouseDown) {
            const dx = event.movementX / 100;
            const dy = -event.movementY / 100;

            const moveVect = new Vector2(dx, dy);
            const rotateDir = moveVect.rotateAround(new Vector2(0, 0), Math.PI * 0.5);

            rotateAroundWorldAxis(this.cube, new Vector3(rotateDir.x, rotateDir.y, 0), Math.sqrt(dx * dx + dy * dy));
            this.renderer.render(this.scene, this.camera);
        }
    }
}

export default Control;
