import {Shape, ShapeGeometry, MeshBasicMaterial, Mesh, Color, Object3D, Group, Plane, PlaneGeometry, DoubleSide, TextureLoader, Vector3} from "three";
import {CubeElement} from "./cubeData";

const textureLoader = new TextureLoader();


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
    const mesh = new Mesh(geometry, material);
    mesh.scale.set(0.9, 0.9, 0.9);

    const square = new SquareMesh(element);
    square.add(mesh);

    const mat2 = new MeshBasicMaterial({
        color: "black",
        side: DoubleSide
    });

    const plane = new Mesh(geometry, mat2);
    plane.position.set(0, 0, -0.01); // 移动靠后一点，防止重叠造成闪烁
    square.add(plane);

    const posX = element.pos.x;
    const posY = element.pos.y;
    const posZ = element.pos.z;
    square.position.set(posX, posY, posZ);

    if (element.withLogo) {
        textureLoader.load("https://pengfeiw.github.io/assests/logo/w.png", (texture) => {
            const geo2 = new PlaneGeometry(1, 1, 1);
            const mat3 = new MeshBasicMaterial({
                map: texture,
                transparent: true
            });
            const avatarPlane = new Mesh(geo2, mat3);
            avatarPlane.position.set(0, 0, 0.01);
            avatarPlane.scale.set(0.8, 0.8, 0.8);
            square.add(avatarPlane);
        });
    }

    square.lookAt(element.pos.clone().add(element.normal));
    return square;
};

export class SquareMesh extends Object3D {
    public element: CubeElement;
    public constructor(element: CubeElement) {
        super();
        this.element = element;
    }
}
