import {using} from 'forest';
import {styled, StyledRoot} from 'foliage';
import {CellType} from './types';


export const Root = styled.div`
  position: relative;
  background-color: gray;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;

  & [data-screen='modal'] {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  & [data-font-size='big'] {
    font-size: 30px;
  }

  & [data-font-size='small'] {
    font-size: 22px;
  }
`;

export const Board = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: calc((20px + 4px) * 15);
`;

export const Cell = styled.div`
  width: 20px;
  height: 20px;
  box-sizing: border-box;
  margin: 2px;
  
  &[data-type='${CellType.EMPTY}'] {
    background-color: lightgray;
  }

  &[data-type='${CellType.SNAKE}'] {
    background-color: black;
  }

  &[data-type='${CellType.FOOD}'] {
    background-color: yellow;
  }
`;

export const Summary = styled.div`
  width: 150px;
  height: calc((20px + 4px) * 15);
  margin-left: 20px;
`;

export const Info = styled.div`
  font-size: 18px;
`;

export const GameScreen = styled.div`
  display: flex;
`;

export const StartScreen = styled.div`
  background-color: rgba(0, 0, 0, 0.9);
`;

export const EndScreen = styled.div`
  background-color: rgba(100, 0, 0, 0.9);
  flex-direction: column;
`;

using(document.head, StyledRoot);
