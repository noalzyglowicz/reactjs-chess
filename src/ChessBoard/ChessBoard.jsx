import React, { Component } from "react";
import "./ChessBoard.css";
import Node from "../Node/Node";
import King from "../Node/Pieces/King";
import Rook from "../Node/Pieces/Rook";
import Pawn from "../Node/Pieces/Pawn";
import Queen from "../Node/Pieces/Queen";
import Bishop from "../Node/Pieces/Bishop";
import Knight from "../Node/Pieces/Knight";
import BlankSquare from "../Node/Pieces/BlankSquare";

export default class ChessBoard extends Component {
  constructor() {
    super();
    this.state = {
      grid: [],
      mouseIsPressed: false,
      isClicked: false,
      clickedCoordinates: [],
    };
  }

  getInitialGrid = () => {
    const grid = [];
    for (let row = 0; row < 8; row++) {
      const currentRow = [];
      for (let col = 0; col < 8; col++) {
        let piece = this.getStartingPiece(row, col);
        currentRow.push(this.createChessSquare(col, row, piece));
      }
      grid.push(currentRow);
    }
    return grid;
  };

  // /**
  //  *
  //  * @param {*} nextRow : y coordinate of space to move to
  //  * @param {*} nextCol : x coordinate of space to move to
  //  * @param {*} piece : tyepe of piece(i.e. Rook, Knight)
  //  */
  // validMove(nextRow, nextCol, piece) {
  //     if(nextRow > piece.row){
  //         let maxRow = nextRow;
  //         let minRow = piece.row;
  //     } else {
  //         let maxRow = piece.row;
  //         let minRow = nextRow;
  //     }
  //     if(nextCol > piece.col){
  //         let maxCol = nextCol;
  //         let minCol = piece.col;
  //     } else {
  //         let maxCol = piece.col;
  //         let minCol = nextCol;
  //     }

  //     for(minRow; minRow < maxRow; minRow++){
  //         for(minCol; minCol < maxCol; minCol++){
  //             if((grid[minRow][minCol].piece.color) == piece.color){
  //                 return false;
  //             }
  //         }
  //     }
  //     return true

  // }

  move(row, col) {
    if (true) {
      let newGrid = this.state.grid.slice();
      let prevNode =
        newGrid[this.state.clickedCoordinates[0]][
          this.state.clickedCoordinates[1]
        ];
      let newNodeAtRowCol = this.createChessSquare(col, row, prevNode.piece);
      newGrid[row][col] = newNodeAtRowCol;
      let piece = <BlankSquare></BlankSquare>;
      newGrid[this.state.clickedCoordinates[0]][
        this.state.clickedCoordinates[1]
      ] = this.createChessSquare(
        this.state.clickedCoordinates[1],
        this.state.clickedCoordinates[0],
        piece
      );
      this.setState({ grid: newGrid });
    }
  }

  handleMouseDown(row, col) {
    if (this.state.isClicked) {
      this.setState({ isClicked: false });
    } else {
      this.setState({ isClicked: true });
    }
    if (this.state.isClicked) {
      this.move(row, col);
    }
    this.setState({ mouseIsPressed: true });
    this.setState({ clickedCoordinates: [row, col] });
  }

  handleMouseUp() {
    this.setState({ mouseIsPressed: false });
  }

  componentDidMount() {
    const grid = this.getInitialGrid();
    this.setState({ grid });
  }

  render() {
    const { grid } = this.state;
    return (
      <div className="grid">
        {grid.map((row, rowIdx) => {
          return (
            <div key={rowIdx}>
              {row.map((node, nodeIdx) => {
                const { row, col, piece } = node;
                return (
                  <Node key={nodeIdx}>
                    row={row}
                    col={col}
                    piece={piece}
                    onMouseDown={() => this.handleMouseDown(row, col)}
                    onMouseUp={() => this.handleMouseUp()}
                  </Node>
                );
              })}
            </div>
          );
        })}
      </div>
    );
  }

  createChessSquare = (col, row, piece) => {
    return {
      row,
      col,
      piece,
    };
  };

  getStartingPiece(row, col) {
    if (row == 1) {
      var piece = (
        <Pawn>
          {" "}
          row={row} col={col} color={"white"}
        </Pawn>
      );
    } else if (row == 0 && (col == 0 || col == 7)) {
      var piece = (
        <Rook>
          {" "}
          row={row} col={col} color={"white"}
        </Rook>
      );
    } else if (row == 0 && (col == 1 || col == 6)) {
      var piece = (
        <Knight>
          {" "}
          row={row} col={col} color={"white"}
        </Knight>
      );
    } else if (row == 0 && (col == 2 || col == 5)) {
      var piece = (
        <Bishop>
          {" "}
          row={row} col={col} color={"white"}
        </Bishop>
      );
    } else if (row == 0 && col == 3) {
      var piece = (
        <Queen>
          {" "}
          row={row} col={col} color={"white"}
        </Queen>
      );
    } else if (row == 0 && col == 4) {
      var piece = (
        <King>
          {" "}
          row={row} col={col} color={"white"}
        </King>
      );
    } else if (row == 6) {
      var piece = (
        <Pawn>
          {" "}
          row={row} col={col} color={"black"}
        </Pawn>
      );
    } else if (row == 7 && (col == 0 || col == 7)) {
      var piece = (
        <Rook>
          {" "}
          row={row} col={col} color={"black"}
        </Rook>
      );
    } else if (row == 7 && (col == 1 || col == 6)) {
      var piece = (
        <Knight>
          {" "}
          row={row} col={col} color={"black"}
        </Knight>
      );
    } else if (row == 7 && (col == 2 || col == 5)) {
      var piece = (
        <Bishop>
          {" "}
          row={row} col={col} color={"black"}
        </Bishop>
      );
    } else if (row == 7 && col == 3) {
      var piece = (
        <Queen>
          {" "}
          row={row} col={col} color={"black"}
        </Queen>
      );
    } else if (row == 7 && col == 4) {
      var piece = (
        <King>
          {" "}
          row={row} col={col} color={"black"}
        </King>
      );
    } else {
      var piece = <BlankSquare></BlankSquare>;
    }
    return piece;
  }
}