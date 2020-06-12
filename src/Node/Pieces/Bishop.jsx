import React, { Component } from "react";
import blackBishop from "./blackBishop.svg";
import whiteBishop from "./whiteBishop.svg";

export default class Bishop extends Component {
  render() {
    if (this.props.color == "black") {
      var source = blackBishop;
    } else {
      var source = whiteBishop;
    }
    return (
      <img src={source} alt="" width="50" height="50" className="image"></img>
    );
  }
}
