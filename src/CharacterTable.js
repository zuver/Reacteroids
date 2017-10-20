import React, { Component } from 'react';
import Alphabet from './Alphabet';

class CharacterTable extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const alphabetCells = Alphabet.map((character, index) => {
      return <td key={index}>{character}</td>
    });

    const characterCounts = Alphabet.map((character, index) => {
      return <td key={index}>{this.props.characters[character] || 0}</td>
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
