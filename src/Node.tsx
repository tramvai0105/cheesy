import { Circle } from "react-konva";
import Food from "./Food";
import Path from "./Path";
import { Dirc } from './enums';

interface NodePath{
    dir: Dirc,
    path: Path,
}

interface Prev{
    node: Node|Path|null,
    dir: Dirc,
}

export default class Node{
    readonly type: string = "node";
    x: number;
    y: number;
    dirs: Dirc[];
    paths: NodePath[];
    food: Food | null = null;
    prev: Prev = {node: null, dir: Dirc.None};

    constructor(x: number, y: number, dirs: Dirc[] = [], paths: NodePath[] = []){
        this.x = x;
        this.y = y;
        this.dirs = dirs;
        this.paths = paths;
    }

    drawNode(i: number){
        return <Circle key={i} x={this.x * 15 + 15 + 1} y={this.y * 15 + 15 + 1} radius={5} fill="green"/>
    }
}