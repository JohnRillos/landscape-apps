/* eslint-disable import/first */
// if (import.meta.env.VITE_ENABLE_WDYR) {
//   import.meta.glob('./wdyr.ts', { eager: true });
// }

/* eslint-disable */
import { EditorView } from 'prosemirror-view';

const oldUpdateState = EditorView.prototype.updateState;

EditorView.prototype.updateState = function updateState(state) {
  if (!(this as any).docView) {
    //return; // This prevents the matchesNode error on hot reloads
  }
  // (this as any).updateStateInner(state, this.state.plugins != state.plugins); //eslint-disable-line
  oldUpdateState.call(this, state);
};

// import React from 'react';
// import { render } from 'react-dom';
import { render } from 'preact';
import App from './app';
import _api from './api';

import './assets/inter-roman.var.woff2';
import './assets/inter-italic.var.woff2';
import './assets/source-code-pro.woff2';

import './styles/index.css';

const IS_MOCK =
  import.meta.env.MODE === 'mock' || import.meta.env.MODE === 'staging';

if (IS_MOCK) {
  window.ship = 'finned-palmer';
  window.our = '~finned-palmer';
}

window.our = `~${window.ship}`;

const root = document.getElementById('app') as HTMLElement;
render(<App />, root);
