import React, { Component } from "react";
import "./Node.css";

export default class Node extends Component {
  render() {
    const rowParity = this.props.row % 2 === 0 ? "even" : "odd";
    const colParity = this.props.col % 2 === 0 ? "Even" : "Odd";
    var cssColor = rowParity + "Row" + colParity + "Node";
    if (this.props.clicked == true) {
      cssColor = "isClicked";
    }
    return (
      <div
        id={`node-${this.props.row}-${this.props.col}`}
        className={cssColor}
        onMouseDown={this.props.onMouseDown}
        onMouseUp={this.props.onMouseUp}
      >
        {this.props.piece}
      </div>
    );
  }
}
