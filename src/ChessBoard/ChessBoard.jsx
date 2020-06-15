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
      availableMoves: [],
    };
  }

  // /**
  //  *
  //  * @param {*} nextRow : y coordinate of space to move to
  //  * @param {*} nextCol : x coordinate of space to move to
  //  * @param {*} piece : type of piece(i.e. Rook, Knight)
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
    console.log(row, col);
    //console.log(this.state.clickedCoordinates);
    let handleMouseDownFunc = () => this.handleMouseDown(row, col);
    let handleMouseUpFunc = () => this.handleMouseUp(row, col);
    if (
      row == this.state.clickedCoordinates[0] &&
      col == this.state.clickedCoordinates[1]
    ) {
      return false;
    }
    let newGrid = this.state.grid.slice();
    let pieceToMove =
      newGrid[this.state.clickedCoordinates[0]][
        this.state.clickedCoordinates[1]
      ].Node.props.piece;
    let newPiece = <BlankSquare></BlankSquare>;
    //console.log(pieceToMove);
    // console.log(
    //   newGrid[this.state.clickedCoordinates[0]][
    //     this.state.clickedCoordinates[1]
    //   ]
    // );
    if (!(newGrid[row][col].Node.props.piece.type.name === "BlankSquare")) {
      if (
        newGrid[row][col].Node.props.piece.props.color ===
        newGrid[this.state.clickedCoordinates[0]][
          this.state.clickedCoordinates[1]
        ].Node.props.piece.props.color
      ) {
        return false;
      }
    }
    newGrid[row][col] = this.createChessSquare(
      col,
      row,
      this.createNode(
        row,
        col,
        pieceToMove,
        handleMouseDownFunc,
        handleMouseUpFunc
      )
    );
    //console.log(newGrid[row][col]);
    console.log("here adding new blank square");
    let newThing = this.createChessSquare(
      this.state.clickedCoordinates[1],
      this.state.clickedCoordinates[0],
      this.createNode(
        this.state.clickedCoordinates[0],
        this.state.clickedCoordinates[1],
        newPiece,
        handleMouseDownFunc,
        handleMouseUpFunc
      )
    );
    newGrid[this.state.clickedCoordinates[0]][
      this.state.clickedCoordinates[1]
    ] = newThing;
    this.setState({ grid: newGrid });
    return true;
  }

  handleMouseDown(row, col) {
    if (this.state.isClicked) {
      this.move(row, col);
    }
    if (this.state.isClicked) {
      this.setState({
        mouseIsPressed: true,
        isClicked: false,
      });
    } else {
      console.log("here updating coordinates");
      this.setState({
        clickedCoordinates: [row, col],
        mouseIsPressed: true,
        isClicked: true,
      });
    }
  }

  handleMouseUp() {
    this.setState({ mouseIsPressed: false });
  }

  render() {
    //console.log(this.state.isClicked);
    const { grid } = this.state;
    return (
      <div className="grid">
        {grid.map((row, rowIdx) => {
          return (
            <div key={rowIdx}>
              {row.map((node, nodeIdx) => {
                const { row, col, Node } = node;
                return Node;
              })}
            </div>
          );
        })}
      </div>
    );
  }

  componentDidMount() {
    const grid = this.getInitialGrid();
    this.setState({ grid });
  }

  getInitialGrid = () => {
    const grid = [];
    for (let row = 0; row < 8; row++) {
      const currentRow = [];
      for (let col = 0; col < 8; col++) {
        let piece = this.getStartingPiece(row, col);
        let handleMouseDownFunc = () => this.handleMouseDown(row, col);
        let handleMouseUpFunc = () => this.handleMouseUp(row, col);
        Node = this.createNode(
          row,
          col,
          piece,
          handleMouseDownFunc,
          handleMouseUpFunc
        );
        currentRow.push(this.createChessSquare(col, row, Node));
      }
      grid.push(currentRow);
    }
    return grid;
  };

  createChessSquare = (col, row, Node) => {
    return {
      row,
      col,
      Node,
    };
  };

  createNode(row, col, piece, handleMouseDownFunc, handleMouseUpFunc) {
    return (
      <Node
        key={col}
        row={row}
        col={col}
        piece={piece}
        onMouseDown={handleMouseDownFunc}
        onMouseUp={handleMouseUpFunc}
      ></Node>
    );
  }

  getStartingPiece(row, col) {
    if (row === 1) {
      var piece = <Pawn row={row} col={col} color={"white"}></Pawn>;
    } else if (row === 0 && (col === 0 || col === 7)) {
      var piece = <Rook row={row} col={col} color={"white"}></Rook>;
    } else if (row === 0 && (col === 1 || col === 6)) {
      var piece = <Knight row={row} col={col} color={"white"}></Knight>;
    } else if (row === 0 && (col === 2 || col === 5)) {
      var piece = <Bishop row={row} col={col} color={"white"}></Bishop>;
    } else if (row === 0 && col === 3) {
      var piece = <Queen row={row} col={col} color={"white"}></Queen>;
    } else if (row === 0 && col === 4) {
      var piece = (
        <King
          row={row}
          col={col}
          color={"white"}
          changeAvailableMoves={this.changeAvailableMoves.bind(this)}
          getClickedCoordinates={this.getClickedCoordinates.bind(this)}
        ></King>
      );
    } else if (row === 6) {
      var piece = <Pawn row={row} col={col} color={"black"}></Pawn>;
    } else if (row === 7 && (col === 0 || col === 7)) {
      var piece = <Rook row={row} col={col} color={"black"}></Rook>;
    } else if (row === 7 && (col === 1 || col === 6)) {
      var piece = <Knight row={row} col={col} color={"black"}></Knight>;
    } else if (row === 7 && (col === 2 || col === 5)) {
      var piece = <Bishop row={row} col={col} color={"black"}></Bishop>;
    } else if (row === 7 && col === 3) {
      var piece = <Queen row={row} col={col} color={"black"}></Queen>;
    } else if (row === 7 && col === 4) {
      var piece = (
        <King
          row={row}
          col={col}
          color={"black"}
          changeAvailableMoves={this.changeAvailableMoves.bind(this)}
          getClickedCoordinates={this.getClickedCoordinates.bind(this)}
        ></King>
      );
    } else {
      var piece = <BlankSquare></BlankSquare>;
    }
    return piece;
  }

  changeAvailableMoves(moves) {
    this.setState({ availableMoves: moves });
  }

  getClickedCoordinates() {
    return this.state.clickedCoordinates;
  }
}
