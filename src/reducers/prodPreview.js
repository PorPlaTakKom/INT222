import {DELPRODPREVIEW, PRODPREVIEW} from "../actions/types";

const initialState = {prodPreview: null}

export default function prodPreview(state = initialState, action) {
  const {type, payload} = action;

  switch (type) {
    case PRODPREVIEW:
      return {...state, prodPreview: payload.prodPreview};
    case DELPRODPREVIEW:
      return {...state, prodPreview: null};
    default:
      return state;
  }

}
