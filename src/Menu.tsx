import React, { Dispatch, SetStateAction } from "react";
import {Stage} from "./enums";
  
interface Props{
    setStage: Dispatch<SetStateAction<Stage>>,
}

function Menu({setStage}:Props){
    return(
        <React.Fragment>
            <span onClick={()=>setStage(Stage.Info)} className="absolute text-yellow-50 left-[90%] bottom-[89%] text-[35px] italic noselect cursor-pointer hover:text-black hover:bg-yellow-50 px-6 rounded-full">i</span>
            <span className='absolute logopopup far-shadow text-yellow-50 text-[55px] font-bold rotate-3 noselect -translate-x-[48%] -translate-y-[100%] w-[650px]'>Все <span onClick={()=>setStage(Stage.Game)} className='border-[6px] border-white p-2 cursor-pointer hover:bg-white hover:text-black'>свиньи</span> любят сыр</span>
        </React.Fragment>
    )
}

export default Menu;