import {Camera, Matrix4, PerspectiveCamera, Raycaster, Scene, Vector2, Vector3, WebGLRenderer} from "three";
import {Cube} from "./cube";
import {rotateAroundWorldAxis, ndcToScreen} from "../util/transform";
import {SquareMesh} from "./square";

let spanEle: HTMLSpanElement;

const testSquareScreenPosition = (cube: Cube, square: SquareMesh, camera: Camera) => {
    if (!spanEle) {
        spanEle = document.createElement("span");
        spanEle.style.position = "absolute";
        spanEle.style.color = "pink";
        document.body.appendChild(spanEle);
    }

    const pos = new Vector3();
    // square.updateMatrixWorld();
    const matrix = new Matrix4().multiply(square.matrixWorld).multiply(cube.matrix);

    pos.applyMatrix4(matrix);
    pos.project(camera);

    const {x, y} = ndcToScreen(pos, window.innerWidth, window.innerHeight);

    spanEle.style.top = `${y}px`;
    spanEle.style.left = `${x}px`;
    console.log(x, y);

    spanEle.innerText = `1`;
};

class Control {
    private renderer: WebGLRenderer;
    private scene: Scene;
    private cube: Cube;
    private camera: PerspectiveCamera;
    private mouseDown = false;
    private mouseDownPos: Vector2 = new Vector2();
    private _square: SquareMesh | null = null;
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

        this.mouseDownPos = new Vector2()
        const intersect = this.getIntersects(event);

        this._square = null;
        if (intersect) {
            this._square = intersect.object as SquareMesh;
            this.mouseDownPos = new Vector2(event.offsetX, event.offsetY);

            // testSquareScreenPosition(this.cube, this._square, this.camera);
        }
    }

    public mouseUpHandle() {
        this.mouseDown = false;
        this._square = null;
    }

    public mouseMoveHandle(event: MouseEvent) {
        if (this.mouseDown) {
            if (this._square) {
                const curMousePos = new Vector2(event.offsetX, event.offsetY);
                this.cube.rotateOnePlane(this.mouseDownPos, curMousePos, this._square, this.camera, {w: this.domElement.width, h: this.domElement.height});
            } else {
                const dx = event.movementX / 100;
                const dy = -event.movementY / 100;

                const moveVect = new Vector2(dx, dy);
                const rotateDir = moveVect.rotateAround(new Vector2(0, 0), Math.PI * 0.5);

                rotateAroundWorldAxis(this.cube, new Vector3(rotateDir.x, rotateDir.y, 0), Math.sqrt(dx * dx + dy * dy));
            }

            this.renderer.render(this.scene, this.camera);
        }
    }

    private getIntersects(event: MouseEvent) {
        const x = (event.offsetX / this.domElement.width) * 2 - 1;
        const y = -(event.offsetY / this.domElement.height) * 2 + 1;

        this.raycaster.setFromCamera({x, y}, this.camera);

        const intersects = this.raycaster.intersectObjects(this.cube.squares);

        if (intersects.length > 0) {
            return intersects[0];
        }

        return null;
    }
}

export default Control;
