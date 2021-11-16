import {DELPRODPREVIEW, PRODPREVIEW} from "../types";

export const pushProdProview = (prod) => (dispatch) => {
  dispatch({type: PRODPREVIEW, payload: {prodPreview:prod}})
  return Promise.resolve()
}
export const DelProdProview = () => (dispatch) => {
  dispatch({type: DELPRODPREVIEW})
  return Promise.resolve()
}