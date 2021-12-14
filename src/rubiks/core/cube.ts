import {Color, Group, Object3D, ColorRepresentation, Vector2, Matrix4, CubeReflectionMapping} from "three";
import CubeData from "./cubeData";
import {createSquare, SquareMesh} from "./square";

export class Cube extends Group {
    private data: CubeData;
    public get squares () {
        return this.children as SquareMesh[];
    }

    public constructor(order = 3) {
        super();

        this.data = new CubeData(order);
        
        for (let i = 0; i < this.data.elements.length; i++) {
            const square = createSquare(new Color(this.data.elements[i].color), this.data.elements[i]); 

            this.add(square);
        }
    }
};
