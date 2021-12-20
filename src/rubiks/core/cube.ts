import {Camera, Color, Group, Matrix4, Vector2, Vector3} from "three";
import {setFinish} from "./statusbar";
import {getAngleBetweenTwoVector2, equalDirection} from "../util/math";
import {ndcToScreen} from "../util/transform";
import CubeData from "./cubeData";
import CubeState, {RotateDirection} from "./cubeState";
import {createSquare, SquareMesh} from "./square";

/**
 * 获取square向里平移0.5的方块大小的位置
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

    /**
     * 魔方阶数
     */
    public get order() {
        return this.data.cubeOrder;
    }

    /**
     * 方块大小
     */
    public get squareSize() {
        return this.data.elementSize;
    }

    /**
     * 是否处于完成状态
     */
    public get finish() {
        return this.state.validateFinish();
    }

    public constructor(order = 3) {
        super();

        this.data = new CubeData(order);


        for (let i = 0; i < this.data.elements.length; i++) {
            const ele = this.data.elements[i];
            // const xy = (Math.floor(order % 2) - 1) * this.data.elementSize * 0.5;
            const withLogo = ele.normal.equals(new Vector3(0, 0, 1)) && ele.pos.equals(new Vector3(0, 0, order / 2 * this.data.elementSize));
            const square = createSquare(new Color(this.data.elements[i].color), this.data.elements[i], withLogo);
            this.add(square);
        }

        this.state = new CubeState(this.squares);

        this.rotateX(Math.PI * 0.25);
        this.rotateY(Math.PI * 0.25);

        setFinish(this.finish);
    }

    /**
     * 旋转一个面
     * @param mousePrePos 旋转前的鼠标的屏幕坐标 
     * @param mouseCurPos 此时的鼠标屏幕坐标
     * @param controlSquare 控制的方块
     * @param camera 相机
     * @param winSize 窗口大小
     */
    public rotateOnePlane(mousePrePos: Vector2, mouseCurPos: Vector2, controlSquare: SquareMesh, camera: Camera, winSize: {w: number; h: number}) {
        if (mouseCurPos.distanceTo(mousePrePos) < 5) {
            return;
        }

        if (!this.squares.includes(controlSquare)) {
            return;
        }

        const screenDir = mouseCurPos.clone().sub(mousePrePos);
        if (screenDir.x === 0 && screenDir.y === 0) return;
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
        // 投影长度的正负值影响魔方旋转的角度方向
        // 旋转的角度 = 投影的长度 / 魔方的尺寸 * 90度
        const temAngle = getAngleBetweenTwoVector2(this.state.rotateDirection!.screenDir, screenDir);
        const screenDirProjectRotateDirLen = Math.cos(temAngle) * screenDir.length();
        const coarseCubeSize = this.getCoarseCubeSize(camera, winSize);
        const rotateAnglePI = screenDirProjectRotateDirLen / coarseCubeSize * Math.PI * 0.5; // 旋转角度
        const newRotateAnglePI = rotateAnglePI - this.state.rotateAnglePI;
        this.state.rotateAnglePI = rotateAnglePI;

        const rotateMat = new Matrix4();
        rotateMat.makeRotationAxis(rotateAxisLocal!, newRotateAnglePI);

        for (let i = 0; i < rotateSquares.length; i++) {
            rotateSquares[i].applyMatrix4(rotateMat);
            rotateSquares[i].updateMatrix();
        }
    }

    /**
     * 旋转后需要更新 cube 的状态
     */
    public getAfterRotateAnimation() {
        const needRotateAnglePI = this.getNeededRotateAngle();
        const rotateSpeed = Math.PI * 0.5 / 1000; // 1s 旋转90度
        let rotatedAngle = 0;

        let rotateTick = (tick: number): boolean => {
            console.log("this", this);
            if (rotatedAngle < Math.abs(needRotateAnglePI)) {
                let curAngle = tick * rotateSpeed
                if (curAngle > Math.abs(needRotateAnglePI)) {
                    curAngle = needRotateAnglePI;
                }

                let angle = curAngle - rotatedAngle;
                angle = needRotateAnglePI > 0 ? angle : -angle;
                rotatedAngle = curAngle;
                const rotateMat = new Matrix4();
                rotateMat.makeRotationAxis(this.state.rotateAxisLocal!, angle);
                for (let i = 0; i < this.state.activeSquares.length; i++) {
                    this.state.activeSquares[i].applyMatrix4(rotateMat);
                    this.state.activeSquares[i].updateMatrix();
                }
                return true;
            } else {
                this.updateStateAfterRotate();
            }
            return false;
        }

        return rotateTick;
    }

    /**
     * 旋转后更新状态
     */
    private updateStateAfterRotate() {
        // 旋转至正位，有时旋转的不是90度的倍数，需要修正到90度的倍数
        const needRotateAnglePI = this.getNeededRotateAngle();
        this.state.rotateAnglePI += needRotateAnglePI;

        // 更新 data：CubeElement 的状态，旋转后法向量、位置等发生了变化
        const angleRelative360PI = this.state.rotateAnglePI % (Math.PI * 2);
        // const timesOfRight = angleRelative360PI / rightAnglePI; // 旋转的角度相当于几个90度

        if (Math.abs(angleRelative360PI) > 0.1) {

            // 更新位置和法向量
            const rotateMat2 = new Matrix4();
            rotateMat2.makeRotationAxis(this.state.rotateAxisLocal!, angleRelative360PI);

            const pn: {
                nor: Vector3;
                pos: Vector3;
            }[] = [];

            for (let i = 0; i < this.state.activeSquares.length; i++) {
                const nor = this.state.activeSquares[i].element.normal.clone();
                const pos = this.state.activeSquares[i].element.pos.clone();

                nor.applyMatrix4(rotateMat2); // 旋转后的法向量
                pos.applyMatrix4(rotateMat2); // 旋转后的位置

                // 找到与旋转后对应的方块，更新它的颜色
                for (let j = 0; j < this.state.activeSquares.length; j++) {
                    const nor2 = this.state.activeSquares[j].element.normal.clone();
                    const pos2 = this.state.activeSquares[j].element.pos.clone();
                    if (equalDirection(nor, nor2) && pos.distanceTo(pos2) < 0.1) {
                        pn.push({
                            nor: nor2,
                            pos: pos2
                        });
                    }
                }
            }

            for (let i = 0; i < this.state.activeSquares.length; i++) {
                this.state.activeSquares[i].element.normal = pn[i].nor;
                this.state.activeSquares[i].element.pos = pn[i].pos;
            }
        }

        this.state.resetState();
    }

    private getNeededRotateAngle() {
        const rightAnglePI = Math.PI * 0.5;
        const exceedAnglePI = Math.abs(this.state.rotateAnglePI) % rightAnglePI;
        let needRotateAnglePI = exceedAnglePI > rightAnglePI * 0.5 ? rightAnglePI - exceedAnglePI : -exceedAnglePI;
        needRotateAnglePI = this.state.rotateAnglePI > 0 ? needRotateAnglePI : -needRotateAnglePI;

        return needRotateAnglePI;
    }
    /**
     * 获取一个粗糙的魔方屏幕尺寸
     */
    public getCoarseCubeSize(camera: Camera, winSize: {w: number; h: number}) {
        const width = this.order * this.squareSize;
        const p1 = new Vector3(-width / 2, 0, 0);
        const p2 = new Vector3(width / 2, 0, 0);

        p1.project(camera);
        p2.project(camera);

        const {w, h} = winSize;
        const screenP1 = ndcToScreen(p1, w, h);
        const screenP2 = ndcToScreen(p2, w, h);

        return Math.abs(screenP2.x - screenP1.x);
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

    /**
     * 打乱
     */
    public disorder() {

    }


};
