import {Camera, Color, Euler, Group, MathUtils, Matrix4, Vector, Vector2, Vector3} from "three";
import {getAngleBetweenTwoVector2} from "../util/math";
import {ndcToScreen} from "../util/transform";
import CubeData from "./cubeData";
import CubeState, {RotateDirection} from "./cubeState";
import {createSquare, SquareMesh} from "./square";

/**
 * 获取square向里平移0.5的方块大小的位置
 * @param square 
 * @param squareSize 
 * @returns 
 */
const getTemPos = (square: SquareMesh, squareSize: number) => {
    const moveVect = square.element.normal.clone().normalize().multiplyScalar(-0.5 * squareSize);
    const pos = square.element.pos.clone();

    return pos.add(moveVect);
};

export class Cube extends Group {
    private data: CubeData;
    public state: CubeState;
    public get squares() {
        return this.children as SquareMesh[];
    }

    public constructor(order = 3) {
        super();

        this.data = new CubeData(order);

        for (let i = 0; i < this.data.elements.length; i++) {
            const square = createSquare(new Color(this.data.elements[i].color), this.data.elements[i]);

            this.add(square);
        }

        this.state = new CubeState(this.squares);
    }

    public rotateOnePlane(mousePrePos: Vector2, mouseCurPos: Vector2, controlSquare: SquareMesh, camera: Camera, winSize: {w: number; h: number}) {
        if (!this.squares.includes(controlSquare)) {
            return;
        }

        const screenDir = mouseCurPos.clone().sub(mousePrePos);
        if (!this.state.inRotation) {
            const squareScreenPos = this.getSquareScreenPos(controlSquare, camera, winSize) as Vector2;

            const squareNormal = controlSquare.element.normal;
            const squarePos = controlSquare.element.pos;

            // 与 controlSquare 在同一面的其他 Square
            const commonDirSquares = this.squares.filter((square) => square.element.normal.equals(squareNormal) && !square.element.pos.equals(squarePos));

            // square1 和 sqaure2 垂直和竖直方向的同一面的两个 SquareMesh
            let square1: SquareMesh | undefined;
            let square2: SquareMesh | undefined;
            for (let i = 0; i < commonDirSquares.length; i++) {
                if (squareNormal.x !== 0) {
                    if (commonDirSquares[i].element.pos.y === squarePos.y) {
                        square1 = commonDirSquares[i];
                    }
                    if (commonDirSquares[i].element.pos.z === squarePos.z) {
                        square2 = commonDirSquares[i];
                    }
                } else if (squareNormal.y !== 0) {
                    if (commonDirSquares[i].element.pos.x === squarePos.x) {
                        square1 = commonDirSquares[i];
                    }
                    if (commonDirSquares[i].element.pos.z === squarePos.z) {
                        square2 = commonDirSquares[i];
                    }
                } else if (squareNormal.z !== 0) {
                    if (commonDirSquares[i].element.pos.x === squarePos.x) {
                        square1 = commonDirSquares[i];
                    }
                    if (commonDirSquares[i].element.pos.y === squarePos.y) {
                        square2 = commonDirSquares[i];
                    }
                }

                if (square1 && square2) {
                    break;
                }
            }

            if (!square1 || !square2) {
                return;
            }

            const square1ScreenPos = this.getSquareScreenPos(square1, camera, winSize) as Vector2;
            const square2ScreenPos = this.getSquareScreenPos(square2, camera, winSize) as Vector2;

            // 记录可能旋转的四个方向
            const squareDirs: RotateDirection[] = [];

            const squareDir1 = {
                screenDir: new Vector2(square1ScreenPos.x - squareScreenPos.x, square1ScreenPos.y - squareScreenPos.y).normalize(),
                startSquare: controlSquare,
                endSquare: square1
            };
            const squareDir2 = {
                screenDir: new Vector2(square2ScreenPos.x - squareScreenPos.x, square2ScreenPos.y - squareScreenPos.y).normalize(),
                startSquare: controlSquare,
                endSquare: square2
            };
            squareDirs.push(squareDir1);
            squareDirs.push({
                screenDir: squareDir1.screenDir.clone().negate(),
                startSquare: square1,
                endSquare: controlSquare
            });
            squareDirs.push(squareDir2);
            squareDirs.push({
                screenDir: squareDir2.screenDir.clone().negate(),
                startSquare: square2,
                endSquare: controlSquare
            });

            // 根据可能旋转的四个方向向量与鼠标平移方向的夹角确定旋转的方向，夹角最小的方向即为旋转方向
            let minAngle = Math.abs(getAngleBetweenTwoVector2(squareDirs[0].screenDir, screenDir));
            let rotateDir = squareDirs[0];  // 最终确定的旋转方向

            for (let i = 0; i < squareDirs.length; i++) {
                const angle = Math.abs(getAngleBetweenTwoVector2(squareDirs[i].screenDir, screenDir));

                if (minAngle > angle) {
                    minAngle = angle;
                    rotateDir = squareDirs[i];
                }
            }

            // 旋转轴：用法向量与旋转的方向的叉积计算
            const rotateDirLocal = rotateDir.endSquare.element.pos.clone().sub(rotateDir.startSquare.element.pos).normalize();
            const rotateAxisLocal = squareNormal.clone().cross(rotateDirLocal).normalize(); // 旋转的轴

            // 旋转的角度：使用 screenDir 在旋转方向上的投影长度，投影长度越长，旋转角度越大
            const screenDirProjectRotateDirLen = Math.cos(minAngle) * screenDir.length();
            const rotateAnglePI = screenDirProjectRotateDirLen / 1000 * Math.PI; // 旋转角度

            // 旋转的方块：由 controlSquare 位置到要旋转的方块的位置的向量，与旋转的轴是垂直的，通过这一特性可以筛选出所有要旋转的方块
            const rotateSquares: SquareMesh[] = [];
            const controlTemPos = getTemPos(controlSquare, this.data.elementSize);

            for (let i = 0; i < this.squares.length; i++) {
                const squareTemPos = getTemPos(this.squares[i], this.data.elementSize);
                const squareVec = controlTemPos.clone().sub(squareTemPos);
                if (squareVec.dot(rotateAxisLocal) === 0) {
                    rotateSquares.push(this.squares[i]);
                }
            }

            this.state.setRotating(controlSquare, rotateSquares, rotateDir, rotateAxisLocal);
        }

        const rotateSquares = this.state.activeSquares; // 旋转的方块
        const rotateAxisLocal = this.state.rotateAxisLocal; // 旋转的轴

        // 旋转的角度：使用 screenDir 在旋转方向上的投影长度，投影长度越长，旋转角度越大
        const temAngle = Math.abs(getAngleBetweenTwoVector2(this.state.rotateDirection!.screenDir, screenDir));
        const screenDirProjectRotateDirLen = Math.cos(temAngle) * screenDir.length();
        const rotateAnglePI = screenDirProjectRotateDirLen / 1000 * Math.PI; // 旋转角度

        const rotateMat = new Matrix4();
        rotateMat.makeRotationAxis(rotateAxisLocal!, rotateAnglePI);

        for (let i = 0; i < rotateSquares.length; i++) {
            rotateSquares[i].applyMatrix4(rotateMat);
            rotateSquares[i].updateMatrix();
        }
    }

    /**
     * 获得 Square 的标准屏幕坐标
     */
    private getSquareScreenPos(square: SquareMesh, camera: Camera, winSize: {w: number; h: number}) {
        if (!this.squares.includes(square)) {
            return null;
        }

        const mat = new Matrix4().multiply(square.matrixWorld).multiply(this.matrix);

        const pos = new Vector3().applyMatrix4(mat);
        pos.project(camera);

        const {w, h} = winSize;
        return ndcToScreen(pos, w, h);
    }
};
