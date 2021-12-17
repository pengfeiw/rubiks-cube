import {Camera, Matrix4, PerspectiveCamera, Raycaster, Scene, Vector2, Vector3, WebGLRenderer} from "three";
import {Cube} from "./cube";
import {rotateAroundWorldAxis, ndcToScreen} from "../util/transform";
import {SquareMesh} from "./square";
import {setFinish} from "./statusbar";

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

        this.mouseDownHandle = this.mouseDownHandle.bind(this);
        this.mouseUpHandle = this.mouseUpHandle.bind(this);
        this.mouseMoveHandle = this.mouseMoveHandle.bind(this);
        this.init();
    }

    private init() {
        this.domElement.addEventListener("mousedown", this.mouseDownHandle);
        this.domElement.addEventListener("mouseup", this.mouseUpHandle);
        this.domElement.addEventListener("mousemove", this.mouseMoveHandle);
    }

    public dispose() {
        this.domElement.removeEventListener("mousedown", this.mouseDownHandle);
        this.domElement.removeEventListener("mouseup", this.mouseUpHandle);
        this.domElement.removeEventListener("mousemove", this.mouseMoveHandle);
    }

    public mouseDownHandle(event: MouseEvent) {
        this.mouseDown = true;

        this.mouseDownPos = new Vector2()
        const intersect = this.getIntersects(event);

        this._square = null;
        if (intersect) {
            this._square = intersect.square;
            this.mouseDownPos = new Vector2(event.offsetX, event.offsetY);

            // testSquareScreenPosition(this.cube, this._square, this.camera);
        }
    }

    public mouseUpHandle() {
        if (this._square) {
            this.cube.afterRotate();
            this.renderer.render(this.scene, this.camera);

            setFinish(this.cube.finish);
        }

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

        // const intersects = this.raycaster.intersectObjects(this.cube.squares);

        let intersectSquares: {
            distance: number;
            square: SquareMesh; 
        }[] = [];
        for (let i = 0; i < this.cube.squares.length; i++) {
            const intersects = this.raycaster.intersectObjects([this.cube.squares[i]]);
            if (intersects.length > 0) {
                intersectSquares.push({
                    distance: intersects[0].distance,
                    square: this.cube.squares[i]
                });
            }
        }
        
        intersectSquares.sort((item1, item2) => item1.distance - item2.distance);

        console.log("intersectSquares", intersectSquares);

        if (intersectSquares.length > 0) {
            return intersectSquares[0];
        }

        return null;
    }
}

export default Control;
