import {
  SENDEDITPROFILE_SUCCESS,
  SENDEDITPROFILE_FAIL,
  SENDEDITADDRESS_SUCCESS,
  SENDEDITADDRESS_FAIL,
} from "../actions/types";
const initialState = {};
export default function edit(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case SENDEDITPROFILE_SUCCESS:
      return { ...state, status: payload.status };
    case SENDEDITPROFILE_FAIL:
      return { ...state, status: payload.status };
    case SENDEDITADDRESS_SUCCESS:
      return { ...state, status: payload.status };
    case SENDEDITADDRESS_FAIL:
      return { ...state, status: payload.status };
    default:
      return state;
  }
}
