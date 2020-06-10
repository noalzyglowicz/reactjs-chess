import React, {Component} from 'react';
import blackKnight from './blackKnight.svg'

export default class Knight extends Component {

    

  render() {
    const {
      row,
      col,
      color,
    } = this.props;
    return (
        <img src={blackKnight} alt="" width="50" height="50" className='image'></img>
    );
  }
}