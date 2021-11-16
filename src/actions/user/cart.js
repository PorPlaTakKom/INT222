import {
	GETCART_SUCCESS,
	PUSHTOCART_SUCCESS, UPDATECART_SUCCESS,
} from "../types";
import ProdService from "../../services/ProdService";

export const pushProd = (cart) => (dispatch) => {
	return ProdService.uploadCart(cart).then( res => {
		dispatch({type: PUSHTOCART_SUCCESS, payload: {cart:res.data}})
		return Promise.resolve()
	})
}

export const updataProd = (cart) => (dispatch) => {
	return ProdService.updateCart(cart).then( res => {
		dispatch({type: UPDATECART_SUCCESS, payload: {cart:res.data}})
		return Promise.resolve()
	})
}

export const getCart = (accountCode) => (dispatch) => {
	return ProdService.getCart(accountCode).then( res => {
		if(res.data.total > 0){
			dispatch({type: GETCART_SUCCESS, payload: {cart:res.data}})
			localStorage.setItem('cart',JSON.stringify(res.data))
		}
	})
}

export const pushProdByloacl = (prod) => (dispatch) => {
	dispatch({type: PUSHTOCART_SUCCESS, payload: {cart:prod}})
	return Promise.resolve()
}