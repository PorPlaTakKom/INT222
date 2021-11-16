import {GETCOLORLIST_SUCCESS} from "../actions/types";

const initialState = {colorList:[]};

export default function colorList(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case GETCOLORLIST_SUCCESS:
      return { ...state, colorList: payload.colorList };
    default:
      return state;
  }
}