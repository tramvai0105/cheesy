import React, { useRef, useState } from "react";
import { Circle, Image as Img, Layer, Line, Rect, Stage } from "react-konva";
import { Dispatch, SetStateAction, useEffect } from 'react';
import {Dirc, Stage as St} from "./enums";
import pig from "./img/pig.png"
import path from "path";

interface Props{
    setStage: Dispatch<SetStateAction<St>>,
}

class Obst{
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

class Node{
    x: number;
    y: number;
    dirs: Dirc[];
    paths: Path[] = [];

    constructor(x: number, y: number, dirs: Dirc[] = []){
        this.x = x;
        this.y = y;
        this.dirs = dirs;
    }

    drawNode(i: number){
        return <Circle key={i} x={this.x * 15 + 15 + 1} y={this.y * 15 + 15 + 1} radius={5} fill="green"/>
    }
}

class Path{
    x: number;
    y: number;
    l: number;
    aligmenent: boolean;
    dirs: Dirc[];
    nodes: Node[] = [];
    h: number;
    w: number;

    constructor(x: number, y: number, l: number, aligmenent: boolean){
        this.x = x;
        this.y = y;
        this.l = l;
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

class _Game{
    
    banDirections : Dirc[] = [Dirc.None];
    allowDirs: Dirc[] = [Dirc.None];
    speed: number = 2;
    moving: boolean = true;
    pigXY = [3, 3];
    progress: number = 0;
    direction : Dirc = Dirc.None;
    directionQuerry : Dirc = Dirc.None;
    setXY: Dispatch<React.SetStateAction<number[]>>;
    obstls: Obst[] = [
            new Obst(2, 2, 8, 1), 
            new Obst(2, 5, 8, 1),
            new Obst(12, 0, 2, 9),
            new Obst(16, 2, 1, 7),
            new Obst(16, 8, 8, 1),
            new Obst(18, 8, 1, 4),
            new Obst(19, 2, 5, 1),
            new Obst(21, 11, 3, 1),
            new Obst(18, 14, 1, 4),
            new Obst(16, 17, 3, 1),
            new Obst(19, 2, 1, 4),
            new Obst(22, 5, 4, 1),
            new Obst(6, 8, 4, 1),
            new Obst(6, 8, 2, 10),
            new Obst(10, 11, 6, 1),
            new Obst(10, 11, 1, 4),
            new Obst(15, 11, 1, 4),
            new Obst(10, 14, 6, 1),
            new Obst(2, 5, 2, 10),
            new Obst(2, 17, 6, 1),
            new Obst(0, 20, 5, 1),
            new Obst(2, 23, 3, 1),
            new Obst(7, 20, 1, 4),
            new Obst(10, 20, 4, 1),
            new Obst(10, 17, 4, 1),
            new Obst(16, 20, 1, 6),
            new Obst(19, 20, 1, 4),
            new Obst(19, 20, 5, 1),
            new Obst(21, 18, 3, 2),
            new Obst(19, 14, 5, 2),
            new Obst(13, 17, 1, 4),
            new Obst(7, 23, 7, 1),
            new Obst(22, 23, 2, 1),
            new Obst(10, 17, 1, 4)
        ];
    nodes: Node[] = [
        new Node(0, 0, [Dirc.Right, Dirc.Down]),
        new Node(10, 0, [Dirc.Left]),
        new Node(0, 3, [Dirc.Up, Dirc.Right, Dirc.Down]),
        new Node(10, 3, [Dirc.Left, Dirc.Up, Dirc.Down]),
        new Node(0, 15, [Dirc.Right, Dirc.Up, Dirc.Down]),
        new Node(4, 15, [Dirc.Left, Dirc.Up]),
        new Node(4, 6, [Dirc.Right, Dirc.Down]),
        new Node(10, 6, [Dirc.Left, Dirc.Up, Dirc.Down]),
        new Node(10, 9, [Dirc.Left, Dirc.Up, Dirc.Right]),
        new Node(14, 9, [Dirc.Left, Dirc.Up, Dirc.Right]),
        new Node(14, 0, [Dirc.Down, Dirc.Right]),
        new Node(17, 0, [Dirc.Down, Dirc.Right, Dirc.Left]),
        new Node(17, 6, [Dirc.Up, Dirc.Right]),
        new Node(24, 0, [Dirc.Left, Dirc.Right]),
        new Node(24, 3, [Dirc.Left, Dirc.Up]),
        new Node(24, 6, [Dirc.Left, Dirc.Down]),
        new Node(24, 9, [Dirc.Left, Dirc.Down, Dirc.Up]),
        new Node(20, 3, [Dirc.Right, Dirc.Down]),
        new Node(20, 6, [Dirc.Up, Dirc.Right]),
        new Node(19, 9, [Dirc.Down, Dirc.Right]),
        new Node(19, 12, [Dirc.Up, Dirc.Left]),
        new Node(16, 12, [Dirc.Right, Dirc.Up, Dirc.Down]),
        new Node(16, 9, [Dirc.Left, Dirc.Down]),
        new Node(0, 18, [Dirc.Right, Dirc.Up]),
        new Node(5, 18, [Dirc.Right, Dirc.Down, Dirc.Left]),
        new Node(5, 21, [Dirc.Up, Dirc.Down, Dirc.Left]),
        new Node(0, 21, [Dirc.Down, Dirc.Right]),
        new Node(0, 24, [Dirc.Up, Dirc.Right]),
        new Node(5, 24, [Dirc.Up, Dirc.Right, Dirc.Left]),
        new Node(14, 24, [Dirc.Up, Dirc.Left]),
        new Node(17, 24, [Dirc.Up, Dirc.Right]),
        new Node(17, 18, [Dirc.Down, Dirc.Right, Dirc.Left]),
        new Node(19, 18, [Dirc.Up, Dirc.Left]),
        new Node(19, 16, [Dirc.Up, Dirc.Left]),
        new Node(24, 12, [Dirc.Up, Dirc.Left, Dirc.Down]),
        new Node(8, 9, [Dirc.Right, Dirc.Down]),
        new Node(24, 16, [Dirc.Up, Dirc.Left, Dirc.Down]),
        new Node(24, 21, [Dirc.Up, Dirc.Left, Dirc.Down]),
        new Node(24, 24, [Dirc.Up, Dirc.Left]),
        new Node(20, 24, [Dirc.Up, Dirc.Left, Dirc.Right]),
        new Node(20, 21, [Dirc.Down, Dirc.Right]),
        new Node(8, 18, [Dirc.Right, Dirc.Up, Dirc.Left, Dirc.Down]),
        new Node(8, 15, [Dirc.Right, Dirc.Up, Dirc.Left, Dirc.Down]),
        new Node(8, 21, [Dirc.Right, Dirc.Up]),
        new Node(14, 21, [Dirc.Left, Dirc.Up, Dirc.Down]),
        new Node(14, 18, [Dirc.Right, Dirc.Up, Dirc.Down]),
        new Node(14, 15, [Dirc.Right, Dirc.Left, Dirc.Down]),
        new Node(16, 15, [Dirc.Left, Dirc.Up]),
        ];
    node: Node | null = this.nodes[0];
    paths: Path[] = [
        new Path(0, 0, 10, false),
        new Path(0, 0, 3, true),
        new Path(0, 3, 10, false),
        new Path(10, 0, 3, true),
        new Path(0, 3, 12, true),
        new Path(0, 15, 4, false),
        new Path(4, 6, 9, true),
        new Path(4, 6, 6, false),
        new Path(10, 3, 3, true),
        new Path(10, 6, 3, true),
        new Path(10, 9, 4, false),
        new Path(14, 0, 9, true),
        new Path(14, 0, 3, false),
        new Path(17, 0, 6, true),
        new Path(17, 0, 7, false),
        new Path(24, 0, 3, true),
        new Path(20, 3, 4, false),
        new Path(20, 3, 3, true),
        new Path(17, 6, 3, false),
        new Path(20, 6, 4, false),
        new Path(24, 6, 3, true),
        new Path(19, 9, 5, false),
        new Path(19, 9, 3, true),
        new Path(16, 12, 3, false),
        new Path(16, 9, 3, true),
        new Path(14, 9, 2, false),
        new Path(0, 15, 3, true),
        new Path(0, 18, 5, false),
        new Path(0, 21, 5, false),
        new Path(0, 24, 5, false),
        new Path(5, 24, 9, false),
        new Path(5, 18, 3, true),
        new Path(5, 21, 3, true),
        new Path(0, 21, 3, true),
        new Path(8, 18, 3, true),
        new Path(5, 18, 3, false),
        new Path(8, 21, 6, false),
        new Path(8, 18, 6, false),
        new Path(8, 15, 6, false),
        new Path(8, 15, 3, true),
        new Path(14, 15, 3, true),
        new Path(14, 18, 3, true),
        new Path(14, 21, 3, true),
        new Path(14, 15, 2, false),
        new Path(16, 12, 3, true),
        new Path(14, 18, 3, false),
        new Path(17, 18, 2, false),
        new Path(17, 18, 6, true),
        new Path(17, 24, 3, false),
        new Path(20, 24, 4, false),
        new Path(20, 21, 4, false),
        new Path(20, 21, 3, true),
        new Path(24, 21, 3, true),
        new Path(24, 16, 5, true),
        new Path(24, 12, 4, true),
        new Path(24, 9, 3, true),
        new Path(19, 16, 5, false),
        new Path(19, 12, 5, false),
        new Path(19, 16, 2, true),
        new Path(8, 9, 6, true),
        new Path(8, 9, 2, false),
        ];
    path: Path | null = null;

    constructor(setXY: Dispatch<React.SetStateAction<number[]>>){
        this.setXY = setXY;
        this.keyDownListener();
        this.connectPathsAndNodes();
    }

    placeObstl(){
        return (
            this.obstls.map((obst, i)=> obst.drawObst(i))
        )
            
    }

    placeNodes(){
        return (
            this.nodes.map((node, i)=> node.drawNode(i))
        )
            
    }

    placePaths(){
        return(
            this.paths.map((path, i)=> path.drawPath(i))
        )
    }

    connectPathsAndNodes=()=>{
        for(let i = 0; i < this.paths.length; i++){
            let path = this.paths[i];
            for(let j = 0; j < this.nodes.length; j++){
                let node = this.nodes[j];
                if(path.x == node.x && path.y == node.y){
                    this.paths[i].nodes[0] = node;
                }
                if(!path.aligmenent && path.x + path.l == node.x && path.y == node.y){
                    this.paths[i].nodes[1] = node;
                }
                if(path.aligmenent && path.x == node.x && path.y + path.l == node.y){
                    this.paths[i].nodes[1] = node;
                }
            }
        }
        for(let i = 0; i < this.paths.length; i++){
            let path = this.paths[i];
            for(let j = 0; j < this.nodes.length; j++){
                let node = this.nodes[j];
                if(node == path.nodes[0]){
                    this.nodes[j].paths.push(path);
                }
                if(node == path.nodes[1]){
                    this.nodes[j].paths.push(path);
                }
            }
        }
    }

    intersect(range1: [number, number], range2: [number, number]){
        if(range1[1] < range2[0] || range2[1] < range1[0]){
            return false
        }
        else return true;
    }

    rectCross(rect: number[]): [boolean, Dirc]{
        let dim = 27
        let pigRect = [this.pigXY[0], this.pigXY[1], dim, dim]
        if(this.intersect([pigRect[0] + dim, pigRect[0] + dim + this.speed], [rect[0], rect[0] + 3])
            && this.intersect([pigRect[1], pigRect[1] + dim],[rect[1], rect[1] + rect[3]]))
        {
            return [true, Dirc.Right]
        }
        if(this.intersect([pigRect[1] - 2, pigRect[1]], [rect[1] + rect[3] - 3 - 4, rect[1] + rect[3] - 4])
            && this.intersect([pigRect[0], pigRect[0] + dim],[rect[0], rect[0] + rect[2]]))
        {
            return [true, Dirc.Up]
        }
        if(this.intersect([pigRect[0] - this.speed, pigRect[0]], [rect[0] + rect[2] - 3, rect[0] + rect[2]])
            && this.intersect([pigRect[1], pigRect[1] + dim],[rect[1], rect[1] + rect[3]]))
        {
            return [true, Dirc.Left]
        }
        if(this.intersect([pigRect[1] + dim, pigRect[1] + dim + this.speed], [rect[1] - 0, rect[1] + 3 - 0])
            && this.intersect([pigRect[0], pigRect[0] + dim],[rect[0], rect[0] + rect[2]]))
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
                    // this.colision();
                    this.checkPath()
                    if(this.direction == Dirc.Right && this.path && this.allowDirs.includes(this.direction)){            
                        this.pigXY = [this.pigXY[0] += this.speed, this.pigXY[1]];
                        this.progress += this.speed;
                        }
                    if(this.direction == Dirc.Left && this.path && this.allowDirs.includes(this.direction)){
                        this.pigXY = [this.pigXY[0] -= this.speed, this.pigXY[1]];
                        this.progress -= this.speed
                        }
                    if(this.direction == Dirc.Up && this.path  && this.allowDirs.includes(this.direction)){
                        this.pigXY = [this.pigXY[0], this.pigXY[1] -= this.speed];
                        this.progress -= this.speed;
                        }
                    if(this.direction == Dirc.Down && this.path  && this.allowDirs.includes(this.direction)){
                        this.pigXY = [this.pigXY[0], this.pigXY[1] += this.speed];
                        this.progress += this.speed;
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
        let borders = [[0, 391, 400, 1],[-2, 0, 1, 401], [0, 1,400,1], [391, 0, 1, 400]];
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

    checkPath(){
        if(this.path){
            if(this.path.dirs[0] == this.directionQuerry || this.path.dirs[1] == this.directionQuerry){
                this.direction = this.directionQuerry;
                this.directionQuerry = Dirc.None;
            }
            if(this.progress >= this.path.l*15){
                this.progress = 0;
                this.node = this.path.nodes[1];
                this.path = null;
                this.allowDirs = this.node.dirs;
            }
            else if(this.progress <= 0){
                this.progress = 0;
                this.node = this.path.nodes[0];
                this.path = null;
                this.allowDirs = this.node.dirs;
            }
        }else if(this.node){
            let node = this.node
            this.pigXY = [this.node.x*15 + 3, this.node.y*15 + 5]
            if(this.directionQuerry != Dirc.None){
                this.direction = this.directionQuerry;
                this.directionQuerry = Dirc.None
            }
            if(this.direction === Dirc.Right){
                for (let i = 0; i < node.paths.length; i++) {
                    let p = node.paths[i]
                    if(!p.aligmenent && p.x == node.x && p.y == node.y){
                        this.path = p;
                        this.allowDirs = p.dirs;
                        this.node = null;
                    }
                }
            }
            if(this.direction === Dirc.Left){
                for (let i = 0; i < node.paths.length; i++) {
                    let p = node.paths[i]
                    if(!p.aligmenent && p.x + p.l == node.x && p.y == node.y){
                        this.path = p;
                        this.allowDirs = p.dirs;
                        this.node = null;
                        this.progress = this.path.l*15
                    }
                }
            }
            if(this.direction === Dirc.Up){
                for (let i = 0; i < node.paths.length; i++) {
                    let p = node.paths[i]
                    if(p.aligmenent && p.x == node.x && p.y + p.l == node.y){
                        this.path = p;
                        this.allowDirs = p.dirs;
                        this.node = null;
                        this.progress = this.path.l*15
                    }
                }
            }
            if(this.direction === Dirc.Down){
                for (let i = 0; i < node.paths.length; i++) {
                    let p = node.paths[i]
                    if(p.aligmenent && p.x == node.x && p.y == node.y){
                        this.path = p;
                        this.allowDirs = p.dirs;
                        this.node = null;
                    }
                }
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
            this.directionQuerry = Dirc.Right
        }
        if(e.key == "ArrowLeft"){
            this.directionQuerry = Dirc.Left
        }
        if(e.key == "ArrowUp"){
            this.directionQuerry = Dirc.Up
        }
        if(e.key == "ArrowDown"){
            this.directionQuerry = Dirc.Down
        }
    }

    keyDownListener(){
        window.addEventListener(("keydown"), this.keysFunction);
    }
}

function Game({setStage}:Props){

    const [pigXYState, setPigXYState] = useState([3, 3])
    const [game, setGame] = useState(new _Game(setPigXYState));

    useEffect(()=>{
        game.gameLoop();
    }, [])

    function PigEmoji(){
        const img = new Image();
        img.src = pig;
        let dims = 27

        return(
            <Img width={dims} height={dims} x={pigXYState[0] - 1} y={pigXYState[1] - 3} image={img}/>
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
            <span onClick={()=>setStage(St.Menu)} className='absolute noselect opacity-70 far-shadow-backtomenu text-[25px] bottom-[86%] right-[86%] text-yellow-50 border-[3px] border-white p-2 cursor-pointer hover:bg-white hover:text-black'>меню</span>
            <div className="absolute border-[6px] far-shadow border-white p-2 -translate-x-[50%] -translate-y-[50%]">
                <Stage className="ml-[6px] mt-[6px]" width={401} height={401}>
                    <Layer>
                        {/* {Grid()} */}
                        {/* <Rect width={390} height={390} stroke="#ADD8E6"/> */}
                        {game.placeObstl()}
                        {/* {game.placeNodes()}
                        {game.placePaths()} */}
                        {PigEmoji()}
                    </Layer>
                </Stage>
            </div>
        </React.Fragment>
    )
}

export default Game;