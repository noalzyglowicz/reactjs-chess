import React, { Component } from "react";
import blackBishop from "./blackBishop.svg";
import whiteBishop from "./whiteBishop.svg";

export default class Bishop extends Component {
  getAvailableMoves = (row, col) => {
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
    if (this.props.color == "black") {
      var source = blackBishop;
    } else {
      var source = whiteBishop;
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
