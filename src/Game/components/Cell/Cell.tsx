import React from "react";
import classnames from "classnames";

import { Cell as CellType } from "../../../types";
import "./cell.css";

interface Props {
  cell: CellType;
  onClick(): void;
}

const Cell = ({ cell, onClick }: Props) => {
  const { adjacentMinesCount, hasMine, isOpen } = cell;

  return (
    <div
      onClick={onClick}
      className={classnames("cell", {
        "cell--with-adjacent-mines": adjacentMinesCount !== 0,
        "cell--mine": hasMine,
        "cell--closed": !isOpen,
      })}
    >
      {isOpen && !hasMine && adjacentMinesCount > 0 && (
        <b>{adjacentMinesCount}</b>
      )}
    </div>
  );
};

export default Cell;
