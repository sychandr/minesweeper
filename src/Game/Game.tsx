import React, { useCallback, useState } from "react";

import Grid from "./components/Grid";
import { GameLogic } from "../gamelogic";
import { GameStatus } from "../types";
import "./game.css";

const { getGrid, getGameStatus } = GameLogic.getInstance();
const Game = () => {
  const grid = getGrid();
  const gameStatus = getGameStatus();
  const [, setRandom] = useState(0);
  // hack to rerender grid and read updated values from GameLogic
  const invokeRerender = useCallback(() => setRandom(Math.random()), []);

  return (
    <div>
      {gameStatus === GameStatus.WON && (
        <h2 className="game-status">You won :)</h2>
      )}
      {gameStatus === GameStatus.LOSE && (
        <h2 className="game-status">You lose :(</h2>
      )}
      <Grid grid={grid} invokeRerender={invokeRerender} />
    </div>
  );
};

export default Game;
