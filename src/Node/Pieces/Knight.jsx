import React, { Component } from "react";
import blackKnight from "./blackKnight.svg";
import whiteKnight from "./whiteKnight.svg";

export default class Knight extends Component {
  getAvailableMoves = (row, col) => {
    let availableMoves = [];
    availableMoves.push([row + 2, col + 1]);
    availableMoves.push([row + 2, col - 1]);
    availableMoves.push([row - 2, col + 1]);
    availableMoves.push([row - 2, col - 1]);
    availableMoves.push([row + 1, col + 2]);
    availableMoves.push([row - 1, col + 2]);
    availableMoves.push([row + 1, col - 2]);
    availableMoves.push([row - 1, col - 2]);

    return availableMoves;
  };

  render() {
    if (this.props.color === "black") {
      var source = blackKnight;
    } else {
      var source = whiteKnight;
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
