import React, { Component } from "react";
import blackKnight from "./blackKnight.svg";
import whiteKnight from "./whiteKnight.svg";

export default class Knight extends Component {
  render() {
    if (this.props.color === "black") {
      var source = blackKnight;
    } else {
      var source = whiteKnight;
    }
    return (
      <img src={source} alt="" width="50" height="50" className="image"></img>
    );
  }
}
