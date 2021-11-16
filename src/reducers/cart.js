import {
	PUSHTOCART_SUCCESS,
	CLEAR_CART, UPDATECART_SUCCESS, GETCART_SUCCESS
} from "../actions/types";

const cart_local = JSON.parse(localStorage.getItem("cart"));
const initialState = cart_local ? { cart:cart_local, total:cart_local.total} : {cart:{}, total:0}
export default function prod(state = initialState, action) {
	const {type, payload} = action;
	switch (type) {
		case PUSHTOCART_SUCCESS:
			return {...state, cart:payload.cart, total:payload.cart.total};
		case UPDATECART_SUCCESS:
			return {...state, cart:payload.cart, total:payload.cart.total};
		case GETCART_SUCCESS:
			return {...state, cart:payload.cart, total:payload.cart.total};
		case CLEAR_CART:
			return {...state, cart: null};
		default:
			return state;
	}
}
