import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Provider from './provider';
import Test from './test';

const App = () => {
  return (
    <>
      <div>Hello Redux-Dogma</div>
      <Test></Test>
    </>
  );
};

ReactDOM.render(
  <Provider>
    <App />
  </Provider>,
  document.getElementById('root')
);
