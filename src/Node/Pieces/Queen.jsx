import React, { Component } from "react";
import blackQueen from "./blackQueen.svg";
import whiteQueen from "./whiteQueen.svg";

export default class Queen extends Component {
  render() {
    if (this.props.color === "black") {
      var source = blackQueen;
    } else {
      var source = whiteQueen;
    }
    return (
      <img src={source} alt="" width="50" height="50" className="image"></img>
    );
  }
}
