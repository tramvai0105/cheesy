import React, { Dispatch, SetStateAction } from "react";
import {Stage} from "./enums";
import monkeyr from "./img/monk-right.png" 

interface Props{
    setStage: Dispatch<SetStateAction<Stage>>,
}

function Info({setStage}:Props){

    return(
        <React.Fragment>
            <span onClick={()=>setStage(Stage.Menu)} className='absolute noselect opacity-70 far-shadow-backtomenu text-[25px] bottom-[86%] right-[86%] text-yellow-50 border-[3px] border-white p-2 cursor-pointer hover:bg-white hover:text-black'>меню</span>
            <div className="absolute flex flex-row text-[30px] w-[700px] left-[20%] top-[17%] text-yellow-50">
                <span>1.</span>  
                <span>Успей раскабанеть от сыра до того как вредный зверь<div className="h-[30px] w-[30px] monk-bg m-0"></div> тебя настигнет.</span>         
            </div>
            <div className="absolute flex flex-row text-[30px] w-[700px] left-[20%] top-[37%] text-yellow-50"> 
                <div className="flex items-center">2. Бегай на 
                    <span className="p-1 mx-2 px-2 border-[4px] border-yellow-50 rounded-xl">{"->"}</span>
                    <span className="p-1 mx-2 px-2 border-[4px] border-yellow-50 rounded-xl">{"<-"}</span>
                    <span style={{writingMode: "vertical-rl"}} className="p-1 py-3 mx-2 border-[4px] border-yellow-50 rounded-xl">{"<-"}</span>
                    <span style={{writingMode: "vertical-rl"}} className="p-1 py-3 mx-2 border-[4px] border-yellow-50 rounded-xl">{"->"}</span>
                </div>         
            </div>
            <span></span>
        </React.Fragment>
    )
}

export default Info;