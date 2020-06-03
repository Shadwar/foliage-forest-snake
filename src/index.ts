import {using, list, spec, h} from "forest";
import {Root, Board, Cell, Summary, Info, GameScreen, StartScreen, EndScreen} from './parts';
import {$cells, $score, $status, keydown} from './logic';
import { Status } from "./types";

function App() {
  window.addEventListener("keydown", e => keydown(e.keyCode));

  Root(() => {
    GameScreen(() => {
      Board(() => {
        list($cells, ({ store }) => Cell({ data: { type: store } }));
      });
  
      Summary(() => {
        Info({text: $score.map(score => `Score: ${score}`)})
      })
    });

    StartScreen(() => {
      spec({
        data: {screen: 'modal'},
        visible: $status.map(status => status === Status.START),
      });

      h('div', {
        text: 'Snake game on Effector + Forest + Foliage',
        data: {fontSize: 'big'},
      });

      h('div', {
        text: 'press any key to continue',
        data: {fontSize: 'small'},
      });
    });

    EndScreen(() => {
      spec({
        data: {screen: 'modal'},
        visible: $status.map(status => status === Status.END),
      })

      h('div', {
        data: {fontSize: 'big'},
        text: $score.map(score => `Game over! Your final score: ${score}`),
      })
      h('div', {
        data: {fontSize: 'small'},
        text: 'press any key to continue',
      })
    });
  });
}

using(document.body, App);
