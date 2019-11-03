import React from 'react';
import ReactDOM from 'react-dom';
import IncrementTest from '../incrementTest';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<IncrementTest />, div);
  ReactDOM.unmountComponentAtNode(div);
});
