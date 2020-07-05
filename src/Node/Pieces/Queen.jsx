import React, { Component } from "react";
import blackQueen from "./blackQueen.svg";
import whiteQueen from "./whiteQueen.svg";

export default class Queen extends Component {
  getAvailableMoves = (row, col) => {
    let availableMoves = [];
    for (let i = 0; i <= 7; i++) {
      availableMoves.push([row, i]);
      availableMoves.push([i, col]);
      availableMoves.push([row + i, col + i]);
      availableMoves.push([row + i, col - i]);
      availableMoves.push([row - i, col + i]);
      availableMoves.push([row - i, col - i]);
    }
    return availableMoves;
  };
  render() {
    if (this.props.color === "black") {
      var source = blackQueen;
    } else {
      var source = whiteQueen;
    }
    var coordinateList = this.getAvailableMoves(this.props.row, this.props.col);
    return (
      <img
        src={source}
        alt=""
        width="50"
        height="50"
        className="image"
        onClick={() =>
          this.props.changeAvailableMoves(
            this.props.row,
            this.props.col,
            coordinateList
          )
        }
      ></img>
    );
  }
}
