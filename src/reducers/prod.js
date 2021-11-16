import {
	UPLOADPRODUCT_SUCCESS,
	UPLOADPRODUCT_FAIL,
	GETPRODUCT_SUCCESS,
	GETPRODUCT_FAIL, PRODEDIT,
	GETAllPRODUCTS_SUCCESS
} from "../actions/types";

const initialState = {prod: null, all_prod: null, status: ""}
export default function prod(state = initialState, action) {
	const {type, payload} = action;

	switch (type) {
		case UPLOADPRODUCT_SUCCESS:
			return {...state, status: payload.status};
		case UPLOADPRODUCT_FAIL:
			return {...state, status: payload.status};
		case GETPRODUCT_SUCCESS:
			return {...state, prod: payload.prod, status: payload.status};
		case GETPRODUCT_FAIL:
			return {...state, status: payload.status};
		case PRODEDIT:
			return {...state, prod: payload}
		case GETAllPRODUCTS_SUCCESS:
			return {...state, all_prod: payload}
		default:
			return state;
	}

}
