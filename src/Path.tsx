import { Rect } from "react-konva";
import { Dirc } from "./enums";
import Node from "./Node";

interface NodePath{
    dir: Dirc,
    node: Node,
}

interface Prev{
    node: Node|Path|null,
    dir: Dirc,
}

export default class Path{
    readonly type: string = "path";
    x: number;
    y: number;
    l: number;
    aligmenent: boolean;
    dirs: Dirc[];
    nodes: NodePath[];
    h: number;
    w: number;
    prev: Prev = {node: null, dir: Dirc.None};

    constructor(x: number, y: number, l: number, aligmenent: boolean, nodes: NodePath[] = []){
        this.x = x;
        this.y = y;
        this.l = l;
        this.nodes = nodes;
        this.aligmenent = aligmenent;
        if(!aligmenent){
            this.w = this.l * 15;
            this.h = 3;
            this.dirs = [Dirc.Right, Dirc.Left];
        }else{
            this.w = 3;
            this.h = this.l * 15;
            this.dirs = [Dirc.Up, Dirc.Down];
        }
    }

    drawPath(i: number){
        return <Rect key={i} height={this.h} width={this.w} x={this.x * 15 + 15} y={this.y * 15 + 15} fill="green"/>
    }
}