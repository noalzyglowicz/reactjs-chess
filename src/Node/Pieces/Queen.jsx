import React, {Component} from 'react';
import blackQueen from './blackQueen.svg'

export default class Queen extends Component {

    

  render() {
    const {
      row,
      col,
      color,
    } = this.props;
    return (
        <img src={blackQueen} alt="" width="50" height="50" className='image'></img>
    );
  }
}