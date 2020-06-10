import React, {Component} from 'react';
import blackKing from './blackKing.svg'

export default class King extends Component {

  // getAvailableMoves = (row, col) => {
  //   availableMoves = [];
  //   if(validMove(row + 1, col + 1)){
  //     availableMoves.push([row + 1, col + 1]);
  //   }
  //   if(validMove(row - 1, col + 1)){
  //     availableMoves.push([row - 1, col + 1]);
  //   }
  //   if(validMove(row + 1, col - 1)){
  //     availableMoves.push([row + 1, col - 1]);
  //   }
  //   if(validMove(row - 1, col - 1)){
  //     availableMoves.push([row - 1, col - 1]);
  //   }
  //   return availableMoves;
  // }

  render() {
    const {
      row,
      col,
    } = this.props;
    return (
        <img src={blackKing} alt="" width="50" height="50" className='image'></img>
    );
  }
}