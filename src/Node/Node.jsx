import React, { Component } from "react";
import "./Node.css";

export default class Node extends Component {
  render() {
    const rowParity = this.props.row % 2 === 0 ? "even" : "odd";
    const colParity = this.props.col % 2 === 0 ? "Even" : "Odd";
    const cssColor = rowParity + "Row" + colParity + "Node";
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
