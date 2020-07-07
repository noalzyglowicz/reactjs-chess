import React, { Component } from "react";
import blackKing from "./blackKing.svg";
import whiteKing from "./whiteKing.svg";

export default class King extends Component {
  getAvailableMoves = (row, col) => {
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
    if (this.props.color === "black") {
      var source = blackKing;
    } else {
      var source = whiteKing;
    }
    var coordinateList = this.getAvailableMoves(this.props.row, this.props.col);
    return (
      <img
        src={source}
        alt=""
        width="50"
        height="50"
        className="image"
        onClick={() => this.props.changeAvailableMoves(coordinateList)}
      ></img>
    );
  }
}
