import React, { Component } from "react";
import blackKnight from "./blackKnight.svg";
import whiteKnight from "./whiteKnight.svg";

export default class Knight extends Component {
  render() {
    const { row, col, color } = this.props;
    if (this.props.children[6] == "black") {
      var source = blackKnight;
    } else {
      var source = whiteKnight;
    }
    return (
      <img src={source} alt="" width="50" height="50" className="image"></img>
    );
  }
}
