import React, { Component } from "react";
import blackKing from "./blackKing.svg";
import whiteKing from "./whiteKing.svg";

export default class King extends Component {
  getMoves = (row, col) => {
    let moves = [];
    moves.push([row + 1, col]);
    moves.push([row - 1, col]);
    moves.push([row, col - 1]);
    moves.push([row, col + 1]);
    moves.push([row + 1, col + 1]);
    moves.push([row - 1, col - 1]);
    moves.push([row + 1, col - 1]);
    moves.push([row - 1, col + 1]);
    return moves;
  };

  render() {
    let source = whiteKing;
    if (this.props.color == "black") {
      source = blackKing;
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
