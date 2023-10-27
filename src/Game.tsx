import React from "react";
import { Layer, Stage } from "react-konva";
import { Dispatch, SetStateAction } from "react";
import {Stage as St} from "./enums";
import pig from "./img/pig.png"

interface Props{
    setStage: Dispatch<SetStateAction<St>>,
}

function Game({setStage}:Props){

    function PigEmoji(){
        // const img = new Image();
        // img.src = 
        
        // return(
        //     img    
        // )
    }

    return(
        <React.Fragment>
            <span onClick={()=>setStage(St.Menu)} className='absolute far-shadow-backtomenu text-[25px] bottom-[86%] right-[86%] text-yellow-50 border-[3px] border-white p-2 cursor-pointer hover:bg-white hover:text-black'>меню</span>
            <div className="absolute border-[6px] far-shadow border-white p-2 -translate-x-[50%] -translate-y-[50%]">
                <Stage width={400} height={400}>
                    <Layer>
                        {PigEmoji()}
                    </Layer>
                </Stage>
            </div>
        </React.Fragment>
    )
}

export default Game;