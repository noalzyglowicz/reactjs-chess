import React, { Component } from "react";
import blackKing from "./blackKing.svg";
import whiteKing from "./whiteKing.svg";

export default class King extends Component {
  // getAvailableMoves = (row, col) => {
  //   availableMoves = [];
  //   if(validMove(row + 1, col + 1)){
  //     availableMoves.push([row + 1, col + 1]);
  //   }
  //   if(validMove(row - 1, col + 1)){
  //     availableMoves.push([row - 1, col + 1]);
  //   }
  //   if(validMove(row + 1, col - 1)){
  //     availableMoves.push([row + 1, col - 1]);
  //   }
  //   if(validMove(row - 1, col - 1)){
  //     availableMoves.push([row - 1, col - 1]);
  //   }
  //   return availableMoves;
  // }

  render() {
    const { row, col, color } = this.props;
    if (this.props.children[6] == "black") {
      var source = blackKing;
    } else {
      var source = whiteKing;
    }
    return (
      <img src={source} alt="" width="50" height="50" className="image"></img>
    );
  }
}
