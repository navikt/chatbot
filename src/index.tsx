import React, {Component} from 'react';
import styled  from 'styled-components';

const Outer = styled.div`
  box-sizing: border-box;

  *,
  *:before,
  *:after {
    box-sizing: inherit;
  }
`;

const Header = styled.h2`
  color: red;
`;

export default class Chat extends Component {
  render() {
    return(
        <Outer>
          <Header>Hei</Header>
        </Outer>
    )
  }
}
