import React, { Component } from "react";
import blackKnight from "./blackKnight.svg";
import whiteKnight from "./whiteKnight.svg";

export default class Knight extends Component {
  render() {
    let source = whiteKnight;
    if (this.props.color === "black") {
      source = blackKnight;
    }
    var coordinateList = this.props.getMoves(this.props.row, this.props.col);
    return (
      <div>
        <img
          src={source}
          alt=""
          width="50"
          height="50"
          className="image"
          onClick={() => this.props.changeMoves(coordinateList)}
        ></img>
      </div>
    );
  }
}
