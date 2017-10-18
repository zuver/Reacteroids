import React, { Component } from 'react';

class CharacterTable extends Component {
  constructor(props) {
    super();
  }

  render() {
    const alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
    const alphabetCells = alphabet.map((character, index) => {
      return <td key={index}>{character}</td>
    });

    const characterCounts = alphabet.map((character, index) => {
      return <td key={index}>0</td>
    });

    return (
      <table>
        <tbody>
          <tr>
            {alphabetCells}
          </tr>
          <tr>
            {characterCounts}
          </tr>
        </tbody>
      </table>
    );
  }
}

export default CharacterTable;
