import { useReducer } from "react";
import DigBtn from "./Components/DigitButtons";
import Operation_Btns from "./Components/OperationButton";
import "./App.css";

export const ACTIONS = {
  ADD_DIGIT: "add-digit",
  CHOOSE_OPR: "choose-operation",
  CLR: "CLR",
  DLT_DIGIT: "delete-digit",
  EVALUATE: "evaluate",
}

function reducer(state, { type, payload }) {
  switch (type) {
    case ACTIONS.ADD_DIGIT:
      if (state.overwrite) {
        return {
          ...state,
          currOperand: payload.digit,
          overwrite: false,
        }
      }
      if (payload.digit === "0" && state.currOperand === "0") {
        return state
      }
      if (payload.digit === "." && state.currOperand.includes(".")) {
        return state
      }

      return {
        ...state,
        currOperand: `${state.currOperand || ""}${payload.digit}`,
      }
    case ACTIONS.CHOOSE_OPR:
      if (state.currOperand == null && state.prevOperand == null) {
        return state
      }

      if (state.currOperand == null) {
        return {
          ...state,
          operation: payload.operation,
        }
      }

      if (state.prevOperand == null) {
        return {
          ...state,
          operation: payload.operation,
          prevOperand: state.currOperand,
          currOperand: null,
        }
      }

      return {
        ...state,
        prevOperand: evaluate(state),
        operation: payload.operation,
        currOperand: null,
      }
    case ACTIONS.CLR:
      return {}
    case ACTIONS.DLT_DIGIT:
      if (state.overwrite) {
        return {
          ...state,
          overwrite: false,
          currOperand: null,
        }
      }
      if (state.currOperand == null) return state
      if (state.currentOperand.length === 1) {
        return { ...state, currOperand: null }
      }

      return {
        ...state,
        currOperand: state.currOperand.slice(0, -1),
      }
    case ACTIONS.EVALUATE:
      if (
        state.operation == null ||
        state.currOperand == null ||
        state.prevOperand == null
      ) {
        return state
      }

      return {
        ...state,
        overwrite: true,
        prevOperand: null,
        operation: null,
        currOperand: evaluate(state),
      }
  }
}

function evaluate({ currOperand, prevOperand, operation }) {
  const prev = parseFloat(prevOperand)
  const current = parseFloat(currOperand)
  if (isNaN(prev) || isNaN(current)) return ""
  let computation = ""
  switch (operation) {
    case "+":
      computation = prev + current
      break
    case "-":
      computation = prev - current
      break
    case "*":
      computation = prev * current
      break
    case "÷":
      computation = prev / current
      break
  }

  return computation.toString()
}

const INTEGER_FORMATTER = new Intl.NumberFormat("en-us", {
  maximumFractionDigits: 0,
})
function formatOperand(operand) {
  if (operand == null) return
  const [integer, decimal] = operand.split(".")
  if (decimal == null) return INTEGER_FORMATTER.format(integer)
  return `${INTEGER_FORMATTER.format(integer)}.${decimal}`
}

function App() {
  const [{ currOperand, prevOperand, operation }, dispatch] = useReducer(
    reducer,
    {}
  )

  return (
    <div className="calculator-gd">
      <div className='out-put'>
          <div className='prev-operand'>
          {formatOperand(prevOperand)} {operation}
          </div>
          <div className='curr-operand'>
            {formatOperand(currOperand)}</div>
      </div>
      <div className='first-hd'>
      <DigBtn digit="1" dispatch={dispatch} />
      <DigBtn digit="2" dispatch={dispatch} />
      <DigBtn digit="3" dispatch={dispatch} />
      <Operation_Btns className="op-y" operation="+" dispatch={dispatch} />
      </div>
      <div className='second-hd'>
      <DigBtn digit="4" dispatch={dispatch} />
      <DigBtn digit="5" dispatch={dispatch} />
      <DigBtn digit="6" dispatch={dispatch} />
      <Operation_Btns className="op-y" operation="-" dispatch={dispatch} />
      </div>
      <div className='third-hd'>
      <DigBtn digit="7" dispatch={dispatch} />
      <DigBtn digit="8" dispatch={dispatch} />
      <DigBtn digit="9" dispatch={dispatch} />
      <Operation_Btns className="op-y" operation="*" dispatch={dispatch} />
      </div>
      <div className='fourth-hd'>
      <button className="clear-btn" onClick={() => dispatch({ type: ACTIONS.CLR })}>C</button>
      <DigBtn digit="0" dispatch={dispatch} />
      <button
        onClick={() => dispatch({ type: ACTIONS.EVALUATE })}
      >
        =
      </button>
      <Operation_Btns className="op-y" operation="÷" dispatch={dispatch} />
      </div>
    </div>
  )
}

export default App