import React, { Component } from "react";
import blackRook from "./blackRook.svg";
import whiteRook from "./whiteRook.svg";

export default class Rook extends Component {
  render() {
    const { row, col, color } = this.props;
    if (this.props.children[6] == "black") {
      var source = blackRook;
    } else {
      var source = whiteRook;
    }
    return (
      <img src={source} alt="" width="50" height="50" className="image"></img>
    );
  }
}
