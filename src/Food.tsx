import {Image as Img} from "react-konva";
import cheese from "./img/cheese.png";

export default class Food{
    x: number;
    y: number;
    width: number;
    height: number;

    constructor(x: number, y: number){
        this.x = x;
        this.y = y;
        this.width = 20;
        this.height = 20;

    }

    drawFood(i: number){
        const img = new Image()
        img.src = cheese;

        return(
            <Img shadowColor="black" shadowOffset={{x: 3, y: 3}} shadowBlur={0.5} shadowOpacity={0.3} key={i} x={this.x * 15 + 4} y={this.y * 15 + 5} width={this.width} height={this.height} image={img}/>
            )
    }

}