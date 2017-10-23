import React, { Component } from 'react';
import { Vowels } from './Alphabet';

class CharacterTable extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const collectedCharacters =
      Object.keys(this.props.characters)
        .filter(character => this.props.characters[character] > 0);

    const alphabetCells = collectedCharacters.map((character, index) => {
      return <td key={index} className={Vowels.includes(character) ? 'vowel' : 'consonant'}>{character}</td>
    });

    const characterCounts = collectedCharacters.map((character, index) => {
      return <td key={index} className={Vowels.includes(character) ? 'vowel' : 'consonant'}>{this.props.characters[character]}</td>
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
