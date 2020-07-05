import React, { Component } from "react";
import blackRook from "./blackRook.svg";
import whiteRook from "./whiteRook.svg";

export default class Rook extends Component {
  getAvailableMoves = (row, col) => {
    let availableMoves = [];
    for (let i = 0; i <= 7; i++) {
      availableMoves.push([row, i]);
      availableMoves.push([i, col]);
    }
    return availableMoves;
  };
  render() {
    if (this.props.color === "black") {
      var source = blackRook;
    } else {
      var source = whiteRook;
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
