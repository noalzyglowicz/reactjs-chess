import React, { Component } from "react";
import blackKing from "./blackKing.svg";
import whiteKing from "./whiteKing.svg";

export default class King extends Component {
  getAvailableMoves = (row, col) => {
    let availableMoves = [];
    availableMoves.push([row + 1, col]);
    availableMoves.push([row - 1, col]);
    availableMoves.push([row, col - 1]);
    availableMoves.push([row, col + 1]);
    availableMoves.push([row + 1, col + 1]);
    availableMoves.push([row - 1, col - 1]);
    availableMoves.push([row + 1, col - 1]);
    availableMoves.push([row - 1, col + 1]);
    return availableMoves;
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
