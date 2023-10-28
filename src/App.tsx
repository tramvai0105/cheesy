import './App.css';
import { useEffect, useState } from 'react';
import useMobileVersion from './useMobileVersion';
import Menu from './Menu';
import Game from './Game';
import {Stage} from './enums';

function App() {

  const version = useMobileVersion();

  const [stage, setStage] = useState<Stage>(Stage.Game)

  function getStage(){
    if(stage == Stage.Menu){
      return(
        <Menu setStage={setStage}/>
      )
    }
    else if(stage == Stage.Game){
      return(
        <Game setStage={setStage}/>
      )
    }
  }

  return (
    <div className="App w-full h-full flex justify-center items-center">
      <div className='bg-themelg relative py-[300px] px-[400px] border-black border-[25px] rounded-[50px]'>
        {getStage()}
      </div>
    </div>
  );
}

export default App;
