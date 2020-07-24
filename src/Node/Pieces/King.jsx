import React, { Component } from "react";
import blackKing from "./blackKing.svg";
import whiteKing from "./whiteKing.svg";

export default class King extends Component {
  render() {
    let source = whiteKing;
    if (this.props.color === "black") {
      source = blackKing;
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
