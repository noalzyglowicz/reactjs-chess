import React, {Component} from 'react';
import blackBishop from './blackBishop.svg'

export default class Bishop extends Component {

    

  render() {
    const {
      row,
      col,
      color,
    } = this.props;
    return (
        <img src={blackBishop} alt="" width="50" height="50" className='image'></img>
    );
  }
}