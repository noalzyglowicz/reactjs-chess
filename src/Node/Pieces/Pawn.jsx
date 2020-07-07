import React, { Component } from "react";
import blackPawn from "./blackPawn.svg";
import whitePawn from "./whitePawn.svg";

export default class Pawn extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isInStartingState: this.props.isInStartingState,
      canBeEnPassanted: this.props.canBeEnPassanted,
    };
  }

  getAvailableMoves = (row, col) => {
    let moves = [];
    if (this.props.color === "black") {
      moves.push([row - 1, col]);
      if (this.state.isInStartingState) {
        moves.push([row - 2, col]);
      }
    } else {
      moves.push([row + 1, col]);
      if (this.state.isInStartingState) {
        moves.push([row + 2, col]);
      }
    }
    return moves;
  };
  render() {
    if (this.props.color === "black") {
      var source = blackPawn;
    } else {
      var source = whitePawn;
    }
    let f = this.props.getSelectedCoordinates;
    var coordinateList = this.getAvailableMoves(this.props.row, this.props.col);
    //var coordinateList = this.getAvailableMoves(f()[0], f()[1]);
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
