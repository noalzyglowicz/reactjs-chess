import React, {Component} from 'react';
import blackPawn from './blackPawn.svg'

export default class Pawn extends Component {

  render() {
    const {
      row,
      col,
      color,
    } = this.props;
    return (
        <img src={blackPawn} alt="" width="50" height="50" className='image'></img>
    );
  }
}