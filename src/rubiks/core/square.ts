import {Shape, ShapeGeometry, MeshBasicMaterial, Mesh, Color} from "three";
import {CubeElement} from "./cubeData";

export const createSquare = (color: Color, element: CubeElement) => {
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
    const material = new MeshBasicMaterial({color});
    const mesh = new SquareMesh(element, geometry, material);

    mesh.scale.set(0.9, 0.9, 0.9);
    const posX = element.pos.x + element.normal.x * 0.5;
    const posY = element.pos.y + element.normal.y * 0.5;
    const posZ = element.pos.z + element.normal.z * 0.5;
    mesh.position.set(posX, posY, posZ);
    mesh.lookAt(element.pos.add(element.normal));

    return mesh;
};

export class SquareMesh extends Mesh<ShapeGeometry, MeshBasicMaterial> {
    public element: CubeElement;
    public constructor(element: CubeElement, geometry: ShapeGeometry, material: MeshBasicMaterial) {
        super(geometry, material);
        this.element = element;
    }
    public clone(recursive?: boolean) {
        const cloned = super.clone(recursive);
        cloned.material = this.material.clone();
        cloned.geometry = this.geometry.clone();
        return cloned;
    }
}
