import {GETCARD_SUCCESS} from "../types";

import UserService from "../../services/UserService";

export const getCard = (addCode) => (dispatch) => {
  return UserService.getCardData(addCode).then( res => {
    dispatch({type: GETCARD_SUCCESS, payload: {cart:res.data}})
    return Promise.resolve()
  })
}