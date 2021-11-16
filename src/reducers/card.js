import {GETCARD_SUCCESS} from "../actions/types";

const initialState = {card: null}

export default function prod(state = initialState, action) {
  const {type, payload} = action;
  switch (type) {
    case GETCARD_SUCCESS:
      return {...state, card:payload.cart};
    default:
      return state;
  }
}
