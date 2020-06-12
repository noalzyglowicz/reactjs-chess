import React, { Component } from "react";
import blackKing from "./blackKing.svg";
import whiteKing from "./whiteKing.svg";

export default class King extends Component {
  constructor() {
    super();
    this.state = {
      row: 0,
      col: 0,
    };
  }
  getAvailableMoves = (row, col) => {
    let availableMoves = [];
    availableMoves.push([row + 1, col]);
    availableMoves.push([row - 1, col]);
    availableMoves.push([row, col - 1]);
    availableMoves.push([row, col + 1]);
    return availableMoves;
  };

  render() {
    if (this.props.color === "black") {
      var source = blackKing;
    } else {
      var source = whiteKing;
    }
    let clickedCoordinates = this.props.getClickedCoordinates();
    var coordinateList = this.getAvailableMoves(
      clickedCoordinates[0],
      clickedCoordinates[1]
    );
    console.log(clickedCoordinates);
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
