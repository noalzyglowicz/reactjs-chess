import React, {Component} from 'react';
import blackRook from './blackRook.svg'

export default class Rook extends Component {

    

  render() {
    const {
      row,
      col,
      color,
    } = this.props;
    return (
        <img src={blackRook} alt="" width="50" height="50" className='image'></img>
    );
  }
}