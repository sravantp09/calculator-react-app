import './App.css';
import { useReducer } from 'react';
import DigitButton from './DigitButton';
import OperationButton from './OperationButton';

export const ACTIONS = {
  ADD_DIGIT : 'add-digit',
  CHOOSE_OPERATION : 'choose-operation',
  CLEAR : 'clear',
  DELETE_DIGIT : 'delete-digit',
  EVALUATE : 'evaluate'
}

const reducer = (state, {type, payload}) => {
  switch(type) {
    case ACTIONS.ADD_DIGIT:
      if (state.overwrite) {
        return {
          ...state,
          currentOperand : payload.digit,
          overwrite: false
        }
      }

      if (payload.digit === "0" && state.currentOperand === '0') return state;

      if (payload.digit === "." && state.currentOperand == null) {
        return {
          ...state,
          currentOperand : payload.digit
        }
      };

      if (payload.digit === "." && state.currentOperand.includes('.')) return state;
      return {...state, currentOperand : `${state.currentOperand || ""}${payload.digit}`}
    case ACTIONS.CLEAR : 
      return {};
    case ACTIONS.CHOOSE_OPERATION:
      if (state.currentOperand == null && state.previousOperand == null) return state;

      if (state.currentOperand == null) {
        return {
          ...state,
          operation : payload.operation
        }
      }

      if (state.previousOperand == null) {
        return {
          ...state,
          operation : payload.operation,
          previousOperand : state.currentOperand,
          currentOperand : null
        }
      }

      return { 
        ...state, 
        previousOperand : evaluate(state), 
        currentOperand : null , 
        operation : payload.operation
      }
    case ACTIONS.EVALUATE:
      if (state.previousOperand == null || state.currentOperand == null || state.operation == null) {
        return state;
      }

      return {
        ...state,
        previousOperand : null,
        overwrite : true,
        operation : null,
        currentOperand : evaluate(state)
      }
    case ACTIONS.DELETE_DIGIT:
      if (state.overwrite) {
        return {
          ...state,
          currentOperand : null,
          overwrite: false
        }
      }

      if (state.currentOperand == null) return state;

      if (state.currentOperand.length === 1) {
        return {
          ...state,
          currentOperand : null
        }
      }

      return {
        ...state,
        currentOperand : state.currentOperand.slice(0, -1)
      }
    default:
      return state;
  }
}

const evaluate = ({currentOperand, previousOperand, operation}) => {
  const prev = parseFloat(previousOperand);
  const curr = parseFloat(currentOperand);
  if (isNaN(prev) || isNaN(curr)) return "";
  let comp = "";
  switch (operation) {
    case '+':
      comp = prev + curr;
      break;
    case '-':
      comp = prev - curr;
      break;
    case '*':
      comp = prev * curr;
      break;
    case '÷':
      comp = prev / curr;
      break;
    default:
      comp = "";
      break;
  }
  return comp;
}

function App() {
  const [{currentOperand, previousOperand, operation}, dispatch] =  useReducer(reducer, {});
  return (
    <div className="calculator-grid">
      <div className="output">
        <div className="previous-operand">{previousOperand} {operation}</div>
        <div className="current-operand">{currentOperand}</div>
      </div>
      <button className="span-two" onClick={() => dispatch({type : ACTIONS.CLEAR})}>AC</button>
      <button onClick={() => dispatch({type : ACTIONS.DELETE_DIGIT})}>DEL</button>
      <OperationButton dispatch={dispatch} operation='÷' />
      <DigitButton dispatch={dispatch} digit='1' />
      <DigitButton dispatch={dispatch} digit='2' />
      <DigitButton dispatch={dispatch} digit='3' />
      <OperationButton dispatch={dispatch} operation='*' />
      <DigitButton dispatch={dispatch} digit='4' />
      <DigitButton dispatch={dispatch} digit='5' />
      <DigitButton dispatch={dispatch} digit='6' />
      <OperationButton dispatch={dispatch} operation='+' />
      <DigitButton dispatch={dispatch} digit='7' />
      <DigitButton dispatch={dispatch} digit='8' />
      <DigitButton dispatch={dispatch} digit='9' />
      <OperationButton dispatch={dispatch} operation='-' />
      <DigitButton dispatch={dispatch} digit='.' />
      <DigitButton dispatch={dispatch} digit='0' />
      <button className='span-two' onClick={() => dispatch({type : ACTIONS.EVALUATE})}>=</button>
    </div>
  );
}

export default App;
