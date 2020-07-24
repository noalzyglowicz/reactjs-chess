import React, { Component } from "react";
import blackBishop from "./blackBishop.svg";
import whiteBishop from "./whiteBishop.svg";

export default class Bishop extends Component {
  render() {
    let source = whiteBishop;
    if (this.props.color === "black") {
      source = blackBishop;
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
