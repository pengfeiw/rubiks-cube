import {Color, Group, Object3D, ColorRepresentation, Vector2, Matrix4, CubeReflectionMapping} from "three";
import CubeData from "./cubeData";
import {createSquare, SquareMesh} from "./square";

const colors: ColorRepresentation[] = [
    "red",
    "orange",
    "yellow",
    "green",
    "cyan",
    "blue",
];

export const createCube2 = () => {
    // gap = 0.1
    const squarePos = [
        new Vector2(-1.1, 1.1),
        new Vector2(0, 1.1),
        new Vector2(1.1, 1.1),
        new Vector2(-1.1, 0),
        new Vector2(0, 0),
        new Vector2(1.1, 0),
        new Vector2(-1.1, -1.1),
        new Vector2(0, -1.1),
        new Vector2(1.1, -1.1)
    ];

    const square = createSquare(new Color(colors[0]));
    const plane: Group = new Group();
    for (let i = 0; i < squarePos.length; i++) {
        const s = square.clone();
        s.translateX(squarePos[i].x);
        s.translateY(squarePos[i].y);
        plane.add(s);
    }

    const planes: Group[] = [plane];

    for (let i = 1; i < colors.length; i++) {
        const p = plane.clone();
        p.children.forEach((child) => (child as SquareMesh).material.color.set(colors[i]));
        planes.push(p);
    }

    // z, rotateX, rotateY
    const transforms = [
        [1.7, Math.PI * 0.5, 0], // 上
        [1.7, -Math.PI * 0.5, 0], // 下
        [1.7, 0, Math.PI * 0.5], // 左
        [1.7, 0, -Math.PI * 0.5], // 右
        [1.7, 0, 0], // 前
        [1.7, Math.PI, 0], // 后
    ];

    for (let i = 0; i < planes.length; i++) {
        if (transforms[i][1] !== 0) {
            planes[i].rotateX(transforms[i][1]);
        }
        if (transforms[i][2] !== 0) {
            planes[i].rotateY(transforms[i][2]);
        }
        planes[i].translateZ(transforms[i][0]);
    }

    const cube = new Group();
    for (let i = planes.length - 1; i >= 0; i--) {
        planes[i].updateMatrix();
        for (let j = planes[i].children.length - 1; j >= 0; j--) {
            const cell = planes[i].children[j];
            cell.applyMatrix4(planes[i].matrix);

            cube.add(cell);
        }
    }
    return cube;
}

export const createCube = () => {
    const translates = [
        new Vector2(-1.1, 1.1),
        new Vector2(0, 1.1),
        new Vector2(1.1, 1.1),
        new Vector2(-1.1, 0),
        new Vector2(0, 0),
        new Vector2(1.1, 0),
        new Vector2(-1.1, -1.1),
        new Vector2(0, -1.1),
        new Vector2(1.1, -1.1)
    ];

    // z, rotateX, rotateY
    const transforms = [
        [1.7, Math.PI * 0.5, 0], // 上
        [1.7, -Math.PI * 0.5, 0], // 下
        [1.7, 0, Math.PI * 0.5], // 左
        [1.7, 0, -Math.PI * 0.5], // 右
        [1.7, 0, 0], // 前
        [1.7, Math.PI, 0], // 后
    ];

    const cube = new Group();

    for (let i = 0; i < transforms.length; i++) {
        const square = createSquare(new Color(colors[i]));
        for (let j = 0; j < translates.length; j++) {
            const s = square.clone();
            s.translateX(translates[j].x);
            s.translateY(translates[j].y);

            const mat = new Matrix4();
            if (transforms[i][1] !== 0) {
                mat.multiply(new Matrix4().makeRotationX(transforms[i][1]));
            }
            if (transforms[i][2] !== 0) {
               mat.multiply(new Matrix4().makeRotationY(transforms[i][2]));
            }
            mat.multiply(new Matrix4().makeTranslation(0, 0, transforms[i][0]));

            s.applyMatrix4(mat);

            cube.add(s);
        }
    }

    return cube;
};

export class Cube extends Group {
    private data: CubeData;
    public constructor(order = 3) {
        super();

        this.data = new CubeData(order);
        
        for (let i = 0; i < this.data.elements.length; i++) {
            const square = createSquare(new Color(this.data.elements[i].color)); 
            square.scale.set(0.9, 0.9, 0.9);
            const posX = this.data.elements[i].pos.x + this.data.elements[i].normal.x * 0.5;
            const posY = this.data.elements[i].pos.y + this.data.elements[i].normal.y * 0.5;
            const posZ = this.data.elements[i].pos.z + this.data.elements[i].normal.z * 0.5;
            square.position.set(posX, posY, posZ);
            square.lookAt(this.data.elements[i].pos.add(this.data.elements[i].normal))

            this.add(square);
        }
    }
};
