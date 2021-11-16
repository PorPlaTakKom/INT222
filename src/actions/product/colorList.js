import ProdService from "../../services/ProdService";
import {GETCOLORLIST_SUCCESS} from "../types";

export const getColorList = () => (dispatch) =>{
  return ProdService.getAllBrandColors().then((res) => {
    dispatch({
      type: GETCOLORLIST_SUCCESS,
      payload: {colorList: res.data},
    })
    return Promise.resolve();
  })
}