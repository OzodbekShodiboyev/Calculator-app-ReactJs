import { ACTIONS } from "../App"

export default function Operation_Btns({ dispatch, operation }) {
  return (
    <button className="op-y"
      onClick={() =>
        dispatch({ type: ACTIONS.CHOOSE_OPR, payload: { operation } })
      }
    >
      {operation}
    </button>
  )
}