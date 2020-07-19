import React, { Component } from "react";
import blackRook from "./blackRook.svg";
import whiteRook from "./whiteRook.svg";

export default class Rook extends Component {
  getMoves = (row, col) => {
    let moves = [];
    for (let i = 0; i <= 7; i++) {
      moves.push([row, i]);
      moves.push([i, col]);
    }
    return moves;
  };

  // componentDidMount() {
  //   this.props.onRefRook(this);
  // }
  // componentWillUnmount() {
  //   this.props.onRefRook(undefined);
  // }
  // method() {
  //   window.alert("am rook");
  // }

  render() {
    let source = whiteRook;
    if (this.props.color === "black") {
      source = blackRook;
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
