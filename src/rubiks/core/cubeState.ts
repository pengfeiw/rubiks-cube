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
    /**
     * 已经旋转的角度（弧度）
     */
    public rotateAnglePI = 0;
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

    public resetState() {
        this.inRotation = false;
        this.activeSquares = [];
        this.controlSquare = undefined;
        this.rotateDirection = undefined;
        this.rotateAxisLocal = undefined;
        this.rotateAnglePI = 0;
    }

    /**
     * 是否是六面对齐
     */
    public validateFinish() {
        let finish = true;

        const sixPlane: {
            nor: Vector3;
            squares: SquareMesh[]
        }[] = [
            {
                nor: new Vector3(0, 1, 0),
                squares: []
            },
            {
                nor: new Vector3(0, -1, 0),
                squares: []
            },
            {
                nor: new Vector3(-1, 0, 0),
                squares: []
            },
            {
                nor: new Vector3(1, 0, 0),
                squares: []
            },
            {
                nor: new Vector3(0, 0, 1),
                squares: []
            },
            {
                nor: new Vector3(0, 0, -1),
                squares: []
            },
        ];

        for (let i = 0; i < this._squares.length; i++) {
            const plane = sixPlane.find((item) => this._squares[i].element.normal.equals(item.nor));
            plane!.squares.push(this._squares[i]);
        }

        for (let i = 0; i < sixPlane.length; i++) {
            const plane = sixPlane[i];
            if (!plane.squares.every((square) => square.element.color === plane.squares[0].element.color)) {
                finish = false;
                break;
            }
        }

        return finish;
    }
}

export default CubeState;
