import {Vector3, Vector2} from "three";
import {SquareMesh} from "./square";

export interface RotateDirection {
    screenDir: Vector2; // 屏幕方向向量
    startSquare: SquareMesh; // 代表方向的起始square，用于记录旋转的local方向
    endSquare: SquareMesh; // 代表方向的终止square，用于记录旋转的local方向
}

class CubeState {
    /** 所有方块 */
    private _squares: SquareMesh[];
    /** 是否正处于旋转状态 */
    public inRotation = false;
    /** 正在旋转的方块 */
    public activeSquares: SquareMesh[] = [];
    /** 控制的方块 */
    public controlSquare: SquareMesh | undefined;
    /** 旋转方向 */
    public rotateDirection: RotateDirection | undefined;
    /** 旋转轴 */
    public rotateAxisLocal: Vector3 | undefined;
    public constructor(squares: SquareMesh[]) {
        this._squares = squares;
    }

    public setRotating(control: SquareMesh, actives: SquareMesh[], direction: RotateDirection, rotateAxisLocal: Vector3) {
        this.inRotation = true;
        this.controlSquare = control;
        this.activeSquares = actives;
        this.rotateDirection = direction;
        this.rotateAxisLocal = rotateAxisLocal;
    }
}

export default CubeState;
