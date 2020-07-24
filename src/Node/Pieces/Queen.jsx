import React, { Component } from "react";
import blackQueen from "./blackQueen.svg";
import whiteQueen from "./whiteQueen.svg";

export default class Queen extends Component {
  render() {
    let source = whiteQueen;
    if (this.props.color === "black") {
      source = blackQueen;
    }
    var coordinateList = this.props.getMoves(this.props.row, this.props.col);
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
