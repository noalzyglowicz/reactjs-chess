import React, { Component } from "react";
import blackPawn from "./blackPawn.svg";
import whitePawn from "./whitePawn.svg";

export default class Pawn extends Component {
  render() {
    const { row, col, color } = this.props;
    if (this.props.children[6] == "black") {
      var source = blackPawn;
    } else {
      var source = whitePawn;
    }
    return (
      <img src={source} alt="" width="50" height="50" className="image"></img>
    );
  }
}