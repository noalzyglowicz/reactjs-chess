import React, { Component } from "react";
import blackBishop from "./blackBishop.svg";
import whiteBishop from "./whiteBishop.svg";

export default class Bishop extends Component {
  getMoves = (row, col) => {
    let moves = [];
    for (let i = 0; i <= 7; i++) {
      moves.push([row + i, col + i]);
      moves.push([row + i, col - i]);
      moves.push([row - i, col + i]);
      moves.push([row - i, col - i]);
    }
    return moves;
  };
  render() {
    let source = whiteBishop;
    if (this.props.color === "black") {
      source = blackBishop;
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
