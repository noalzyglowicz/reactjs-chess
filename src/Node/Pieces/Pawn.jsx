import React, { Component } from "react";
import blackPawn from "./blackPawn.svg";
import whitePawn from "./whitePawn.svg";

export default class Pawn extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isInStartingState: this.props.isInStartingState,
    };
  }

  render() {
    let source = whitePawn;
    if (this.props.color === "black") {
      source = blackPawn;
    }
    var coordinateList = this.props.getMoves(
      this.props.row,
      this.props.col,
      this.props.color,
      this.state.isInStartingState
    );
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
