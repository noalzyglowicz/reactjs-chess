import React, { Component } from "react";

export default class BlankSquare extends Component {
  render() {
    const { row, col, color } = this.props;
    return <div></div>;
  }
}
