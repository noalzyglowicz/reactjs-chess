import React, { Component } from "react";
import blackKnight from "./blackKnight.svg";
import whiteKnight from "./whiteKnight.svg";

export default class Knight extends Component {
  getMoves = (row, col) => {
    let moves = [];
    moves.push([row + 2, col + 1]);
    moves.push([row + 2, col - 1]);
    moves.push([row - 2, col + 1]);
    moves.push([row - 2, col - 1]);
    moves.push([row + 1, col + 2]);
    moves.push([row - 1, col + 2]);
    moves.push([row + 1, col - 2]);
    moves.push([row - 1, col - 2]);

    return moves;
  };

  render() {
    let source = whiteKnight;
    if (this.props.color == "black") {
      source = blackKnight;
    }
    var coordinateList = this.getMoves(this.props.row, this.props.col);
    return (
      <img
        src={source}
        alt=""
        width="50"
        height="50"
        className="image"
        onClick={() => this.props.changeMoves(coordinateList)}
      ></img>
    );
  }
}
