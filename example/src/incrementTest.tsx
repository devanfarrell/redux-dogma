import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { increment, decrement, countSelector } from './redux/count';
import { increment2, decrement2, countSelector2 } from './redux/count2';
import { clearIncrements } from './redux/sharedActions';

const InrementTest = () => {
  const dispatch = useDispatch();

  const localIncrement = () => {
    dispatch(increment());
  };
  const localDecrement = () => {
    dispatch(decrement());
  };

  const localIncrement2 = () => {
    dispatch(increment2());
  };
  const localDecrement2 = () => {
    dispatch(decrement2());
  };
  const localClearIncrements = () => {
    dispatch(clearIncrements());
  };

  const number = useSelector(countSelector);
  const number2 = useSelector(countSelector2);

  return (
    <div>
      <button onClick={localIncrement}>+</button>
      <button onClick={localDecrement}>-</button>
      <div>{number}</div>
      <br></br>
      <button onClick={localIncrement2}>+</button>
      <button onClick={localDecrement2}>-</button>
      <div>{number2}</div>
      <br></br>
      <button onClick={localClearIncrements}>Clear Incements</button>
    </div>
  );
};

export default InrementTest;
