import React, { Component } from "react";
import blackQueen from "./blackQueen.svg";
import whiteQueen from "./whiteQueen.svg";

export default class Queen extends Component {
  getMoves = (row, col) => {
    let moves = [];
    for (let i = 0; i <= 7; i++) {
      moves.push([row, i]);
      moves.push([i, col]);
      moves.push([row + i, col + i]);
      moves.push([row + i, col - i]);
      moves.push([row - i, col + i]);
      moves.push([row - i, col - i]);
    }
    return moves;
  };
  render() {
    if (this.props.color === "black") {
      var source = blackQueen;
    } else {
      var source = whiteQueen;
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
