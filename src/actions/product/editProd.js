import ProdService from "../../services/ProdService";
import {GETPRODUCTSELLER} from "../types";

export const getProdEdit = (prodCode) => (dispatch) =>{
  return ProdService.getProdByProdCode(prodCode).then((res) => {
    dispatch({
      type: GETPRODUCTSELLER,
      payload: {prod_seller: res.data},
    })
    return Promise.resolve();
  })
}