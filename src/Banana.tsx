import {Image as Img} from "react-konva";
import banana from "./img/banana.png";

export default class Banana{
    x: number;
    y: number;
    width: number;
    height: number;
    size: number;
    dif: number;

    constructor(x: number, y: number, size: number = 2, dif: number = 0){
        this.x = x;
        this.y = y;
        this.size = size;
        this.dif = dif;
        this.width = 12 * this.size;
        this.height = 12 * this.size;

    }

    drawBanana(i: number){
        const img = new Image()
        img.src = banana;

        return(
            <Img shadowColor="black" shadowOffset={{x: 5, y: 5}} shadowBlur={0.5} shadowOpacity={0.3} key={i} x={this.x * 15 + 2 - this.dif} y={this.y * 15 + 2 - this.dif} width={this.width} height={this.height} image={img}/>
            )
    }

}