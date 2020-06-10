import React, {Component} from 'react';
import King from './Pieces/King'
import './Node.css';

export default class Node extends Component {

  render() {
    const {
      row,
      col,
      piece,
      onMouseDown,
      onMouseUp,
    } = this.props;
      const rowParity = this.props.children[1] % 2 == 0 ? 'even': 'odd'
      const colParity = this.props.children[3] % 2 == 0 ? 'Even': 'Odd'
      const cssColor = rowParity + "Row" + colParity + "Node"
    return (
      <div
        id={`node-${row}-${col}`}
        className={cssColor}
        onMouseDown={this.props.children[7]}
        onMouseUp={this.props.children[9]}
        >
          {this.props.children[5]}
        </div>
    );
  }
}