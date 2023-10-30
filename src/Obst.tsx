import { Rect } from "react-konva";

export default class Obst{
    x: number;
    y: number;
    width: number;
    height: number;
    c: number;
    b: number;

    constructor(x: number, y: number, width: number, 
        height: number, c: number = 1, b: number = 0){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.c = c;
        this.b = b;
    }

    getDims(){
        return [this.x*15 + this.c, this.y*15 + this.c, this.width*15 - this.b*this.width, this.height*15 - this.b*this.height];
    }

    drawObst(i: number){
        return(
            <Rect key={i} x={this.x*15 + this.c} y={this.y*15 + this.c} height={this.height*15 - this.b*this.height} width={this.width*15 - this.b*this.width} stroke="#ADD8E6"/>
        )
    }
}