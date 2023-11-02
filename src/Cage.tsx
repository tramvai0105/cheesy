import {Image as Img} from "react-konva";
import cage from "./img/cage.svg";

export default class Cage{
    x: number;
    y: number;
    width: number;
    height: number;

    constructor(x: number, y: number){
        this.x = x;
        this.y = y;
        this.width = 40;
        this.height = 36;

    }

    drawCage(i: number){
        const img = new Image()
        img.src = cage;

        return(
            <Img key={i} x={this.x * 15 - 14} y={this.y * 15 + 10} width={this.width} height={this.height} image={img}/>
            )
    }

}