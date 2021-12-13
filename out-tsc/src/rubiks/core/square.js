import { Shape, ShapeGeometry, MeshBasicMaterial, Mesh } from "three";
export const createSquare = (color) => {
    const squareShape = new Shape();
    const x = 0, y = 0;
    // top
    squareShape.moveTo(x - 0.4, y + 0.5);
    squareShape.lineTo(x + 0.4, y + 0.5);
    squareShape.bezierCurveTo(x + 0.5, y + 0.5, x + 0.5, y + 0.5, x + 0.5, y + 0.4);
    // right
    squareShape.lineTo(x + 0.5, y - 0.4);
    squareShape.bezierCurveTo(x + 0.5, y - 0.5, x + 0.5, y - 0.5, x + 0.4, y - 0.5);
    // bottom
    squareShape.lineTo(x - 0.4, y - 0.5);
    squareShape.bezierCurveTo(x - 0.5, y - 0.5, x - 0.5, y - 0.5, x - 0.5, y - 0.4);
    // left
    squareShape.lineTo(x - 0.5, y + 0.4);
    squareShape.bezierCurveTo(x - 0.5, y + 0.5, x - 0.5, y + 0.5, x - 0.4, y + 0.5);
    const geometry = new ShapeGeometry(squareShape);
    const material = new MeshBasicMaterial({ color });
    const mesh = new SquareMesh(geometry, material);
    return mesh;
};
export class SquareMesh extends Mesh {
    constructor(geometry, material) {
        super(geometry, material);
    }
    clone(recursive) {
        const cloned = super.clone(recursive);
        cloned.material = this.material.clone();
        cloned.geometry = this.geometry.clone();
        return cloned;
    }
}
//# sourceMappingURL=square.js.map