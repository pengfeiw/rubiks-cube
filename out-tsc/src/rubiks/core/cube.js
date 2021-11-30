import { Color, Group, Vector2 } from "three";
import { createSquare } from "./square";
const colors = [
    "red",
    "orange",
    "yellow",
    "green",
    "cyan",
    "blue",
];
export const createCube = () => {
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
    const plane = new Group();
    for (let i = 0; i < squarePos.length; i++) {
        const s = square.clone();
        s.translateX(squarePos[i].x);
        s.translateY(squarePos[i].y);
        plane.add(s);
    }
    const planes = [plane];
    for (let i = 1; i < colors.length; i++) {
        const p = plane.clone();
        p.children.forEach((child) => child.material.color.set(colors[i]));
        planes.push(p);
    }
    // z, rotateX, rotateY
    const transforms = [
        [1.7, Math.PI * 0.5, 0],
        [1.7, -Math.PI * 0.5, 0],
        [1.7, 0, Math.PI * 0.5],
        [1.7, 0, -Math.PI * 0.5],
        [1.7, 0, 0],
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
    planes.forEach((item) => cube.add(item));
    return cube;
};
//# sourceMappingURL=cube.js.map