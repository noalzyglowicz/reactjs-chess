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

  getMoves = (row, col) => {
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

  // componentDidMount() {
  //   this.props.onRef(this);
  // }
  // componentWillUnmount() {
  //   this.props.onRef(undefined);
  // }

  // getAlert() {
  //   window.alert("am pawn");
  // }

  render() {
    let source = whitePawn;
    if (this.props.color === "black") {
      source = blackPawn;
    }
    var coordinateList = this.getMoves(this.props.row, this.props.col);
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
