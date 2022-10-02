import React from "react";

import Cell from "../Cell";
import { GameLogic } from "../../../gamelogic";
import { Cell as CellType } from "../../../types";
import "./grid.css";

const { handleCellClick } = GameLogic.getInstance();

interface Props {
  grid: CellType[][];
  invokeRerender(): void;
}

const Field = ({ grid, invokeRerender }: Props) => (
  <div className="grid-container">
    <div>
      {grid.map((row, y) => (
        <div key={y} className="grid-row">
          {row.map((cell, x) => (
            <Cell
              cell={cell}
              key={x}
              onClick={() => {
                handleCellClick(y, x);
                invokeRerender();
              }}
            />
          ))}
        </div>
      ))}
    </div>
  </div>
);

export default Field;
