import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import IncrementTest from './incrementTest';
import Provider from './redux/provider';

ReactDOM.render(
  <Provider>
    <IncrementTest />
  </Provider>,
  document.getElementById('root')
);
