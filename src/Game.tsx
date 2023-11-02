import React, { useRef, useState } from "react";
import { Circle, Image as Img, Layer, Line, Rect, Stage } from "react-konva";
import { Dispatch, SetStateAction, useEffect } from 'react';
import {Dirc, Stage as St} from "./enums";
import pig from "./img/pig.png"
import monkeyl from "./img/monk-left.png" 
import monkeyr from "./img/monk-right.png" 
import Obst from "./Obst";
import Node from "./Node";
import Path from "./Path";
import Food from "./Food";
import cheese from "./img/cheese.png";
import Cage from "./Cage";

interface Props{
    setStage: Dispatch<SetStateAction<St>>,
}

function delay(duration: number = 50) {
    return new Promise((resolve) => {
      setTimeout(resolve, duration);
    });
  }

function getRandomInt(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

enum GameStatus{
    Start,
    Play,
    Over,
    Intro,
}

class Monkey{
    x: number;
    y: number;
    dims: number;
    speed: number = 2;
    lastPlace: Node | Path | null = null;
    moving: boolean = true;
    banDirections : Dirc[] = [Dirc.None];
    allowDirs: Dirc[] = [Dirc.None];
    moveOrder: [Dirc, (Node|Path|null)][] = [];
    moveTarget: Node | Path | null = null;
    node: Node | null = null;
    path: Path | null = null;
    progress: number = 0;
    direction : Dirc = Dirc.None;
    setMonkXY: Dispatch<React.SetStateAction<number[]>>;

    constructor(node: Node, setMonkXY: Dispatch<React.SetStateAction<number[]>>){
        this.setMonkXY = setMonkXY;
        this.x = node.x;
        this.y = node.y;
        this.node = node;
        setMonkXY([this.x*15, this.y*15]);
        this.dims = 20
    }
    
    filterDirs(node: Node){
        let dirs : Dirc[] = [];
        if(this.direction == Dirc.Up){
            dirs = node.dirs.filter((dir)=>dir != Dirc.Down)
        }
        if(this.direction == Dirc.Down){
            dirs = node.dirs.filter((dir)=>dir != Dirc.Up)
        }
        if(this.direction == Dirc.Right){
            dirs = node.dirs.filter((dir)=>dir != Dirc.Left)
        }
        if(this.direction == Dirc.Left){
            dirs = node.dirs.filter((dir)=>dir != Dirc.Right)
        }
        let dir = dirs[getRandomInt(0, dirs.length - 1)]
        return dir;
    }

    setCoords(x: number, y: number){
        this.x = x;
        this.y = y;
    }

    startAnimation(setCage: Dispatch<React.SetStateAction<boolean>>, res: (value: unknown) => void){
        let move = (s: number) => {
            this.setCoords(this.x + s, this.y);
            this.setMonkXY([this.x, this.y]);
        }
        Promise.resolve()
            .then(()=>move(2))
            .then(()=>delay())
            .then(()=>move(2))
            .then(()=>delay())
            .then(()=>move(2))
            .then(()=>delay())
            .then(()=>move(2))
            .then(()=>delay())
            .then(()=>move(2))
            .then(()=>delay())
            .then(()=>move(2))
            .then(()=>delay())
            .then(()=>move(2))
            .then(()=>delay())
            .then(()=>move(2))
            .then(()=>delay())
            .then(()=>move(2))
            .then(()=>delay())
            .then(()=>move(2))
            .then(()=>delay())
            .then(()=>move(2))
            .then(()=>delay(650))
            .then(()=>move(-6))
            .then(()=>delay(500))
            .then(()=>move(9))
            .then(()=>delay(300))
            .then(()=>move(-6))
            .then(()=>delay(200))
            .then(()=>move(9))
            .then(()=>delay(200))
            .then(()=>move(-6))
            .then(()=>delay(500))
            .then(()=>{move(30);setCage(false)})
            .then(()=>move(2))
            .then(()=>delay())
            .then(()=>move(2))
            .then(()=>delay())
            .then(()=>move(2))
            .then(()=>delay())
            .then(()=>move(2))
            .then(()=>delay())
            .then(()=>move(2))
            .then(()=>move(2))
            .then(()=>delay())
            .then(()=>move(2))
            .then(()=>delay())
            .then(()=>move(2))
            .then(()=>delay())
            .then(()=>move(2))
            .then(()=>delay())
            .then(()=>{
                this.x = 16*15 + 1;
                this.y = 12*15 + 5;
                this.setMonkXY([this.x, this.y]);
            })
            .then(()=>delay(200))
            .then(()=>res(null))
    }

    chooseNode(reacheble: (Node | Path | null)[], target: Node | Path){
        let shortest: [Node | Path | null, number] = [null, 1000000000];
        for(let i = 0; i < reacheble.length; i++){
            let node = reacheble[i]
            if(node){
                let distance : number = 100000;
                distance = Math.sqrt((target.x - node.x)**2 + (target.y - node.y)**2)
                if(node instanceof Path){
                    if(!node.aligmenent){
                        distance = Math.sqrt((target.x - node.x + node.l)**2 + (target.y - node.y)**2)
                    }
                    if(node.aligmenent){
                        distance = Math.sqrt((target.x - node.x)**2 + (target.y - node.y + node.l)**2)
                    }
                }
                if(distance < shortest[1]){
                    shortest = [node, distance];
                }
            }
        }
        return shortest[0];
    }

    findPath(target: Node | Path | null, prog: number, pigXY: {x: number, y: number}){
        if(target == null){
            return;
        }
        if(target == this.path){
            return;
        }
        let reachable: (Node|Path|null)[];
        reachable = [this.node || this.path]
        if(reachable[0] == null){
            return;
        }
        let explored: (Node|Path|null)[] = [];
        while(reachable.length > 0){
            let node = this.chooseNode(reachable, target);
            if(node == target){
                let path: (Node|Path)[] = [];
                let dirs: Dirc[] = [];
                while(node != null){
                    path.push(node);
                    dirs.push(node.prev.dir);
                    node = node.prev.node;
                }
                dirs.pop()
                path.pop()
                dirs.reverse()
                path.reverse()
                let res: [Dirc, (Node|Path|null)][] = [];
                for(let i = 0; i < dirs.length + 0;i++){
                    res.push([dirs[i], path[i]])
                }
                let lastRes;
                if(res[res.length - 1]){
                lastRes = res[res.length - 1][1]}
                this.moveOrder = res;
                console.log(res);
                this.lastPlace = target;
                return;
            }
            reachable.splice(reachable.indexOf(node), 1)
            explored.push(node);
            if(node && node instanceof Node){ 
                let newReachable: Path[] | undefined = node.paths.map(path=> path.path).filter((path)=>{
                    return !explored.includes(path);
                })                
                if(newReachable == undefined){
                    return;
                }
                for(let i = 0; i < newReachable.length; i++){
                    if(!reachable.includes(newReachable[i])){
                        newReachable[i].prev.node = node;
                        let nr = newReachable[i]
                        newReachable[i].prev.dir = node.paths.filter(path=> path.path == nr)[0].dir
                        reachable.push(newReachable[i])
                    }
                } 
            }
            if(node && node instanceof Path){
                let newReachable: Node[] | undefined = node.nodes.map(path=> path.node).filter((node)=>{
                    return !explored.includes(node);
                })
                
                if(newReachable == undefined){
                    return;
                }
                for(let i = 0; i < newReachable.length; i++){
                    if(!reachable.includes(newReachable[i])){
                        newReachable[i].prev.node = node;
                        let nr = newReachable[i]
                        newReachable[i].prev.dir = node.nodes.filter(node=> node.node == nr)[0].dir
                        reachable.push(newReachable[i])
                    }
                }
            }
        }
    }

    checkPath(){
        if(this.moveTarget != null && (this.node == this.moveTarget || this.path == this.moveTarget)){
            this.moveOrder.shift()
            this.moveTarget = null;
        }
        if(this.moveOrder.length > 0 && this.moveTarget == null){
            this.moveTarget = this.moveOrder[0][1]
            this.direction = this.moveOrder[0][0]
        }
        if(this.path){
            if(this.progress >= this.path.l*15){
                this.progress = 0;
                this.node = this.path.nodes.filter(node=> node.dir == Dirc.Down || node.dir == Dirc.Right).map(node=>node.node)[0];
                this.path = null;
                this.allowDirs = this.node.dirs;
            }
            else if(this.progress <= 0){
                this.progress = 0;
                this.node = this.path.nodes.filter(node=> node.dir == Dirc.Up || node.dir == Dirc.Left).map(node=>node.node)[0];
                this.path = null;
                this.allowDirs = this.node.dirs;
            }
        }else if(this.node){
            let node = this.node;
            this.x = this.node.x*15 + 3
            this.y = this.node.y*15 + 5
            if(this.direction === Dirc.Right){
                for (let i = 0; i < node.paths.length; i++) {
                    let p = node.paths[i]
                    if(p.dir == Dirc.Right){
                        this.path = p.path;
                        this.allowDirs = p.path.dirs;
                        this.node = null;
                    }
                }
            }
            if(this.direction === Dirc.Left){
                for (let i = 0; i < node.paths.length; i++) {
                    let p = node.paths[i]
                    if(p.dir == Dirc.Left){
                        this.path = p.path;
                        this.allowDirs = p.path.dirs;
                        this.node = null;
                        this.progress = this.path.l*15
                    }
                }
            }
            if(this.direction === Dirc.Up){
                for (let i = 0; i < node.paths.length; i++) {
                    let p = node.paths[i]
                    if(p.dir == Dirc.Up){
                        this.path = p.path;
                        this.allowDirs = p.path.dirs;
                        this.node = null;
                        this.progress = this.path.l*15
                    }
                }
            }
            if(this.direction === Dirc.Down){
                for (let i = 0; i < node.paths.length; i++) {
                    let p = node.paths[i]
                    if(p.dir == Dirc.Down){
                        this.path = p.path;
                        this.allowDirs = p.path.dirs;
                        this.node = null;
                    }
                }
            }
        }
    }
}

class _Game{
    status: GameStatus = GameStatus.Start;
    banDirections : Dirc[] = [Dirc.None];
    allowDirs: Dirc[] = [Dirc.None];
    monk: Monkey;
    speed: number = 2;
    moving: boolean = true;
    perf: number[] = [];
    foodCounter : number = 0;
    foodQuantity : number = 15;
    pigXY = [3, 3];
    progress: number = 0;
    setCage: Dispatch<React.SetStateAction<boolean>>;
    alert: boolean = false;
    direction : Dirc = Dirc.None;
    directionQuerry : Dirc = Dirc.Down;
    monkStartNode: Node[] = [];
    pigStartNode: Node[] = [];
    setXY: Dispatch<React.SetStateAction<number[]>>;
    cage: Cage = new Cage(15, 11)
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
            // new Obst(15, 11, 1, 4),
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
        new Node(10, 0, [Dirc.Left, Dirc.Down]),
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
        new Node(24, 0, [Dirc.Left, Dirc.Down]),
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
        new Node(19, 16, [Dirc.Down, Dirc.Left]),
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
    foods: Food[] = []; 

    constructor(setXY: Dispatch<React.SetStateAction<number[]>>, setMonkXY: Dispatch<React.SetStateAction<number[]>>, setCage: Dispatch<React.SetStateAction<boolean>>){
        this.setXY = setXY;
        this.keyDownListener();
        this.setCage = setCage;
        this.connectPathsAndNodes();
        this.monkStartNode = this.nodes.filter(node=> node.x == 16 && node.y == 12); 
        this.pigStartNode = this.nodes.filter(node=> node.x == 0 && node.y == 0); 
        this.monk = new Monkey(this.monkStartNode[0], setMonkXY)
    }

    intro(){
        this.status = GameStatus.Intro;
        this.monk.setMonkXY([170, 185]);
        this.monk.setCoords(170, 185);
        this.addFoods()
        new Promise(res=>this.monk.startAnimation(this.setCage, res))
            .then(()=>{
                this.alert = true;
                setTimeout(()=>this.alert = false, 600)
                this.start()})
    }

    start(){
        this.status = GameStatus.Play;
        this.monk.findPath(this.node || this.path, this.progress,{x: this.pigXY[0],y: this.pigXY[1]});
        this.clearPrev();
    }

    gameover(){
        this.status = GameStatus.Over;
    }

    restart(){ 
        this.node = this.pigStartNode[0];
        this.path = null;
        this.banDirections = [Dirc.None];
        this.allowDirs = [Dirc.None];
        this.progress = 0;
        this.direction = Dirc.None;
        this.pigXY = [3, 3];
        this.setXY(this.pigXY)
        this.monk.moveOrder = [];
        this.monk.moveTarget = null;
        this.monk.node = this.monkStartNode[0];
        this.monk.path = null;
        this.monk.progress = 0;
        this.monk.direction = Dirc.None;
        this.monk.setCoords(this.monk.node.x*15, this.monk.node.y*15)
        this.monk.setMonkXY([this.monk.node.x*15, this.monk.node.y*15]);
        this.addFoods();
        this.foodCounter = 0;
        this.status = GameStatus.Play;
        }

    clearPrev(){
        for(let i = 0; i < this.paths.length; i++){
            this.paths[i].prev.node = null;
            this.paths[i].prev.dir = Dirc.None;
        }for(let i = 0; i < this.nodes.length; i++){
            this.nodes[i].prev.node = null;
            this.nodes[i].prev.dir = Dirc.None;
        }
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

    placeFoods(){
        let foods = this.nodes.filter((node)=> node.food);
        return(
            foods.map((node, i)=>{if(node.food){return node.food.drawFood(i)}})
        )
    }

    addFoods(){
        for (var i = this.nodes.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = this.nodes[i];
            this.nodes[i] = this.nodes[j];
            this.nodes[j] = temp;
        }
        for(let i = 0; i < this.foodQuantity; i++){
            if(this.nodes[i]){
                if(this.nodes[i].x == 0 && this.nodes[i].y == 0){
                    this.nodes[i+16].food = new Food(this.nodes[i+16].x, this.nodes[i+16].y)
                }else{
                this.nodes[i].food = new Food(this.nodes[i].x, this.nodes[i].y)
                }
            }else{throw Error("Недостаточно нод")}
        }
    }

    connectPathsAndNodes=()=>{
        for(let i = 0; i < this.paths.length; i++){
            let path = this.paths[i];
            for(let j = 0; j < this.nodes.length; j++){
                let node = this.nodes[j];
                if(path.x == node.x && path.y == node.y){
                    if(!path.aligmenent){
                        this.paths[i].nodes.push({dir: Dirc.Left, node: node});
                    }
                    if(path.aligmenent){
                        this.paths[i].nodes.push({dir: Dirc.Up, node: node});
                    }
                }
                if(!path.aligmenent && path.x + path.l == node.x && path.y == node.y){
                    this.paths[i].nodes.push({dir: Dirc.Right, node: node});
                }
                if(path.aligmenent && path.x == node.x && path.y + path.l == node.y){
                    this.paths[i].nodes.push({dir: Dirc.Down, node: node});
                }
            }
        }
        for(let i = 0; i < this.paths.length; i++){
            let path = this.paths[i];
            for(let j = 0; j < this.nodes.length; j++){
                let node = this.nodes[j];
                if(path.nodes.map(node=>node.node).includes(node)){
                    if(!path.aligmenent && node.x == path.x && node.y == path.y){
                        this.nodes[j].paths.push({dir: Dirc.Right, path: path});
                    }
                    if(!path.aligmenent && node.x == path.x + path.l && node.y == path.y){
                        this.nodes[j].paths.push({dir: Dirc.Left, path: path});
                    }
                    if(path.aligmenent && node.x == path.x && node.y == path.y + path.l){
                        this.nodes[j].paths.push({dir: Dirc.Up, path: path});
                    }
                    if(path.aligmenent && node.x == path.x && node.y == path.y){
                        this.nodes[j].paths.push({dir: Dirc.Down, path: path});
                    }
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
        let dim = 5
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

    move(){
        if(this.moving){
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
    }

    moveMonk(){
        if(!this.monk.moving){
            return;
        }
        if(this.monk.moveOrder.length < 1){
            if(!this.monk.path?.aligmenent){
                if(this.monk.progress > this.progress){
                    this.monk.direction = Dirc.Left;
                }
                if(this.monk.progress < this.progress){
                    this.monk.direction = Dirc.Right;
                }
            }
            if(this.monk.path?.aligmenent){
                if(this.monk.progress > this.progress){
                    this.monk.direction = Dirc.Up;
                }
                if(this.monk.progress < this.progress){
                    this.monk.direction = Dirc.Down;
                }
            }
        }else{
            this.monk.checkPath()
        }
        if(this.monk.direction == Dirc.Right && this.monk.path && this.monk.allowDirs.includes(this.monk.direction)){            
            this.monk.x += this.monk.speed
            this.monk.progress += this.monk.speed
            }
        if(this.monk.direction == Dirc.Left && this.monk.path && this.monk.allowDirs.includes(this.monk.direction)){
            this.monk.x -= this.monk.speed;
            this.monk.progress -= this.monk.speed
            }
        if(this.monk.direction == Dirc.Up && this.monk.path  && this.monk.allowDirs.includes(this.monk.direction)){
            this.monk.y -= this.monk.speed;
            this.monk.progress -= this.monk.speed;
            }
        if(this.monk.direction == Dirc.Down && this.monk.path  && this.monk.allowDirs.includes(this.monk.direction)){
            this.monk.y += this.monk.speed;
            this.monk.progress += this.monk.speed;
            }    
    }

    loop=()=>{
        let mt = 0
        let gameSpeed = 1
        let lp = 0;
        let _loop = (perf: number) =>{
            if(lp > gameSpeed && this.status == GameStatus.Play){
                if(mt > 4){
                    let target = this.node || this.path;
                    if (target != this.monk.lastPlace) {
                        this.clearPrev();
                        this.monk.moveTarget = null;
                        this.monk.moveOrder = [];
                        this.monk.direction = Dirc.None;
                        this.monk.findPath(this.node || this.path, this.progress,{x: this.pigXY[0],y: this.pigXY[1]});
                        console.log("found path");
                    }
                    mt = 0;
                }
                this.move();
                this.moveMonk();
                this.setXY(this.pigXY);
                this.monk.setMonkXY([this.monk.x, this.monk.y]);
                this.colision()
                lp = 0;
                }
            mt += 1;
            lp += 1;
            this.perf.push(performance.now())
            if(this.perf.length > 2 && this.perf[this.perf.length - 1] - this.perf[this.perf.length - 2] > 30){
                gameSpeed = 0;
            }
            if(this.perf.length > 2 && this.perf[this.perf.length - 1] - this.perf[this.perf.length - 2] < 30){
                gameSpeed = 1;
            }
            if(this.perf.length > 10){
                this.perf = []
            }
            requestAnimationFrame(_loop);
        }
        _loop(0);
    }

    colision(){
        let borders = [[0, 391, 400, 1],[-2, 0, 1, 401], [0, 1,400,1], [391, 0, 1, 400]];
        let obstls = [...this.obstls.map((obst)=> obst.getDims())];
        let colisionObjects = [[this.monk.x, this.monk.y, 25, 25]];
        let res: [boolean, Dirc] = this.rectCross(colisionObjects[0])       
        if(res[0]){
            this.gameover();
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
                this.node = this.path.nodes.filter(node=> node.dir == Dirc.Down || node.dir == Dirc.Right).map(node=>node.node)[0];
                this.path = null;
                this.allowDirs = this.node.dirs;
            }
            else if(this.progress <= 0){
                this.progress = 0;
                this.node = this.path.nodes.filter(node=> node.dir == Dirc.Up || node.dir == Dirc.Left).map(node=>node.node)[0];
                this.path = null;
                this.allowDirs = this.node.dirs;
            }
        }else if(this.node){
            let node = this.node;  
            if(this.node.food){
                this.node.food = null;
                this.foodCounter += 1; 
            }
            this.pigXY = [this.node.x*15 + 3, this.node.y*15 + 5]
            if(this.directionQuerry != Dirc.None){
                this.direction = this.directionQuerry;
                this.directionQuerry = Dirc.None
            }
            if(this.direction === Dirc.Right){
                for (let i = 0; i < node.paths.length; i++) {
                    let p = node.paths[i]
                    if(p.dir == Dirc.Right){
                        this.path = p.path;
                        this.allowDirs = p.path.dirs;
                        this.node = null;
                    }
                }
            }
            if(this.direction === Dirc.Left){
                for (let i = 0; i < node.paths.length; i++) {
                    let p = node.paths[i]
                    if(p.dir == Dirc.Left){
                        this.path = p.path;
                        this.allowDirs = p.path.dirs;
                        this.node = null;
                        this.progress = this.path.l*15
                    }
                }
            }
            if(this.direction === Dirc.Up){
                for (let i = 0; i < node.paths.length; i++) {
                    let p = node.paths[i]
                    if(p.dir == Dirc.Up){
                        this.path = p.path;
                        this.allowDirs = p.path.dirs;
                        this.node = null;
                        this.progress = this.path.l*15
                    }
                }
            }
            if(this.direction === Dirc.Down){
                for (let i = 0; i < node.paths.length; i++) {
                    let p = node.paths[i]
                    if(p.dir == Dirc.Down){
                        this.path = p.path;
                        this.allowDirs = p.path.dirs;
                        this.node = null;
                    }
                }
            }
        }
    }

    gameLoop =()=>{
        if(this){
            requestAnimationFrame(this.loop)
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
    const [monkXYState, setMonkXYState] = useState([100, 100])
    const [cage, setCage] = useState(true);
    const [game, setGame] = useState(()=>new _Game(setPigXYState, setMonkXYState, setCage));

    useEffect(()=>{
        game.gameLoop();
    }, [])

    function PigEmoji(){
        const img = new Image();
        img.src = pig;
        let dims = 27

        if(game.status != GameStatus.Start){
        return(
            <Img width={dims} height={dims} x={pigXYState[0] - 1} y={pigXYState[1] - 3} image={img}/>
        )}
    }

    function MonkEmoji(){
        const img = new Image();
        img.src = monkeyr;
        let dims = 27
        if(game.status != GameStatus.Start){
        return(
            <Img width={dims} height={dims} x={monkXYState[0] - 2} y={monkXYState[1] - 2} image={img}/>
        )}
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

    function placeCage(){
        if(cage){
            return game.cage.drawCage(0)}
    }

    return(
        <React.Fragment>
            <span onClick={()=>setStage(St.Menu)} className='absolute noselect opacity-70 far-shadow-backtomenu text-[25px] bottom-[86%] right-[86%] text-yellow-50 border-[3px] border-white p-2 cursor-pointer hover:bg-white hover:text-black'>меню</span>
            <div className="absolute flex flex-row text-white text-[36px] bottom-[85%] left-[85%]">
                <img className="w-[36px] h-[36px] m-3" src={cheese}/><span className="">{game.foodCounter}</span> 
            </div>
            {(game.alert)?<span className="absolute left-[50%] bottom-[30%] text-[52px] bg-white p-1 -translate-x-[50%] z-20 text-blue-400 rounded-2xl">Хватай сыр!</span>:<></>}
            {(game.status == GameStatus.Start)?
            <div onClick={()=>game.intro()} className="absolute cursor-pointer z-10 text-[40px] bg-white w-[220px] h-[220px] flex items-center justify-center 
            rounded-full -translate-x-[50%] -translate-y-[50%] noselect"><span className="relative -translate-y-2">старт</span></div>:<></>}
            {(game.status == GameStatus.Over)?
            <div onClick={() => game.restart()} className="absolute bg-opacity-50 cursor-pointer z-10 text-[40px] bg-white w-[220px] h-[220px] flex items-center justify-center 
            rounded-full -translate-x-[50%] -translate-y-[50%] noselect"><span className="relative -translate-y-2">рестарт?</span></div>:<></>}
            <div className="absolute border-[6px] far-shadow-game border-white p-2 -translate-x-[50%] -translate-y-[50%]">
                <Stage className="ml-[6px] mt-[6px]" width={401} height={401}>
                    <Layer>
                        {/* {Grid()} */}
                        {/* <Rect width={390} height={390} stroke="#ADD8E6"/> */}
                        {game.placeObstl()}
                        {game.placeFoods()}
                        {/* {game.placeNodes()}
                        {game.placePaths()} */}
                        {placeCage()}
                        {PigEmoji()}
                        {MonkEmoji()}
                    </Layer>
                </Stage>
            </div>
        </React.Fragment>
    )
}

export default Game;