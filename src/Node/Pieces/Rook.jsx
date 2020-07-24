import React, { Component } from "react";
import blackRook from "./blackRook.svg";
import whiteRook from "./whiteRook.svg";

export default class Rook extends Component {
  render() {
    let source = whiteRook;
    if (this.props.color === "black") {
      source = blackRook;
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
