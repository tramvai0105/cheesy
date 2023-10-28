import React, { useRef, useState } from "react";
import { Image as Img, Layer, Line, Rect, Stage } from "react-konva";
import { Dispatch, SetStateAction, useEffect } from 'react';
import {Dirc, Stage as St} from "./enums";
import pig from "./img/pig.png"

interface Props{
    setStage: Dispatch<SetStateAction<St>>,
}

class Obst{
    x: number;
    y: number;
    width: number;
    height: number;

    constructor(x: number, y: number, width: number, height: number){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    getDims(){
        return [this.x * 15 + 2, this.y*15 + 2, this.width*15 - 2, this.height*15 - 2];
    }

    getElement(i: number){
        return(
            <Rect key={i} x={this.x*15 + 2} y={this.y*15 - 2} height={this.height*15 - 2} width={this.width*15 - 2} stroke="blue"/>
        )
    }
}

class _Game{
    
    banDirections : Dirc[] = [Dirc.None];
    speed: number = 2;
    moving: boolean = true;
    pigXY = [1, 1];
    direction : Dirc = Dirc.None;
    setXY: Dispatch<React.SetStateAction<number[]>>;
    obstls: Obst[] = [new Obst(4, 4, 4, 2), new Obst(4, 8, 4, 2)];

    constructor(setXY: Dispatch<React.SetStateAction<number[]>>){
        this.setXY = setXY;
        this.keyDownListener();
    }

    placeObstl(){
        return (
            this.obstls.map((obst, i)=> obst.getElement(i))
        )
            
    }

    intersect(range1: [number, number], range2: [number, number]){
        if(range1[1] < range2[0] || range2[1] < range1[0]){
            return false
        }
        else return true;
    }

    rectCross(rect: number[]): [boolean, Dirc]{
        let pigRect = [this.pigXY[0], this.pigXY[1], 30, 30]
        if(this.intersect([pigRect[0] + 30, pigRect[0] + 30 + this.speed], [rect[0], rect[0] + 3])
            && this.intersect([pigRect[1], pigRect[1] + 30],[rect[1], rect[1] + rect[3]]))
        {
            return [true, Dirc.Right]
        }
        if(this.intersect([pigRect[1] - 2, pigRect[1]], [rect[1] + rect[3] - 3 - 4, rect[1] + rect[3] - 4])
            && this.intersect([pigRect[0], pigRect[0] + 30],[rect[0], rect[0] + rect[2]]))
        {
            return [true, Dirc.Up]
        }
        if(this.intersect([pigRect[0] - this.speed, pigRect[0]], [rect[0] + rect[2] - 3, rect[0] + rect[2]])
            && this.intersect([pigRect[1], pigRect[1] + 30],[rect[1], rect[1] + rect[3]]))
        {
            return [true, Dirc.Left]
        }
        if(this.intersect([pigRect[1] + 30, pigRect[1] + 30 + this.speed], [rect[1] - 2, rect[1] + 3 - 2])
            && this.intersect([pigRect[0], pigRect[0] + 30],[rect[0], rect[0] + rect[2]]))
        {
            return [true, Dirc.Down]
        }
        return [false, Dirc.None]
    }

    loop=()=>{
        let lp = 0;
        let _loop = () =>{
            if(lp > 1){
                if(this.moving){
                    this.colision();
                    if(this.direction == Dirc.Right && !this.banDirections.includes(this.direction)){            
                        this.pigXY = [this.pigXY[0] += this.speed, this.pigXY[1]];
                        }
                    if(this.direction == Dirc.Left && !this.banDirections.includes(this.direction)){
                        this.pigXY = [this.pigXY[0] -= this.speed, this.pigXY[1]];
                        }
                    if(this.direction == Dirc.Up && !this.banDirections.includes(this.direction)){
                        this.pigXY = [this.pigXY[0], this.pigXY[1] -= this.speed];
                        }
                    if(this.direction == Dirc.Down && !this.banDirections.includes(this.direction)){
                        this.pigXY = [this.pigXY[0], this.pigXY[1] += this.speed];
                        }    
                    }
                    this.setXY(this.pigXY);
                    lp = 0;
            }
            lp += 1;
            requestAnimationFrame(_loop);
        }
        _loop();
    }

    colision(){
        let borders = [[0, 391, 400, 1],[-1, 0, 1, 401], [0, 0,400,1], [391, 0, 1, 400]];
        let obstls = [...this.obstls.map((obst)=> obst.getDims())];
        let colisionObjects = [...borders, ...obstls];

        this.banDirections = [Dirc.None]
        for(let i = 0; i < colisionObjects.length; i++){
            let res: [boolean, Dirc] = this.rectCross(colisionObjects[i])       
            if(res[0]){
                this.banDirections.push(res[1]);
            }
        }
    }

    gameLoop =()=>{
        if(this){
            window.requestAnimationFrame(this.loop)
        }
    }
    
    keysFunction=(e: KeyboardEvent)=>{
        if(e.key == "ArrowRight"){
            this.direction = Dirc.Right
        }
        if(e.key == "ArrowLeft"){
            this.direction = Dirc.Left
        }
        if(e.key == "ArrowUp"){
            this.direction = Dirc.Up
        }
        if(e.key == "ArrowDown"){
            this.direction = Dirc.Down
        }
    }

    keyDownListener(){
        window.addEventListener(("keydown"), this.keysFunction);
    }
}

function Game({setStage}:Props){

    const [pigXYState, setPigXYState] = useState([0, 0])
    const [game, setGame] = useState(new _Game(setPigXYState));

    useEffect(()=>{
        game.gameLoop();
    }, [])

    function PigEmoji(){
        const img = new Image();
        img.src = pig;
        
        return(
            <Img width={30} x={pigXYState[0]} y={pigXYState[1]} height={30} image={img}/>
        )
    }

    function Grid(){
        let cells = [];
        for(let i = 0; i < 26; i++){
            for(let j = 0; j <26; j++){
                cells.push(<Rect x={15*i + 1} y={j*15 + 1} width={15} height={15} stroke="white"/>)
            }
        }
        return cells;
    }

    return(
        <React.Fragment>
            <span onClick={()=>setStage(St.Menu)} className='absolute opacity-70 far-shadow-backtomenu text-[25px] bottom-[86%] right-[86%] text-yellow-50 border-[3px] border-white p-2 cursor-pointer hover:bg-white hover:text-black'>меню</span>
            <div className="absolute border-[6px] far-shadow border-white p-2 -translate-x-[50%] -translate-y-[50%]">
                <Stage className="ml-[6px] mt-[6px]" width={401} height={401}>
                    <Layer>
                        {game.placeObstl()}
                        {PigEmoji()}
                        {/* {Grid()} */}
                    </Layer>
                </Stage>
            </div>
        </React.Fragment>
    )
}

export default Game;