import {
	LOGIN_SUCCESS,
	LOGIN_FAIL,
	REGISTER_SUCCESS,
	REGISTER_FAIL,
	RESENDCODE_SUCCESS,
	RESENDCODE_FAIL,
	LOGOUT,
} from "../actions/types";
import AuthService from "../services/AuthService";

const user = AuthService.getCurrentUser()

const initialState = user
	? {isLoggedIn: true, user: user, refCode: null}
	: {isLoggedIn: false, user: null, refCode: null};

export default function auth(state = initialState, action) {
	const {type, payload} = action;

	switch (type) {
		case LOGIN_SUCCESS:
			return {
				...state,
				isLoggedIn: true,
				user: payload.user,
			};
		case LOGIN_FAIL:
			return {
				...state,
				isLoggedIn: false,
				user: null,
			};
		case REGISTER_SUCCESS:
			return {
				...state,
				isLoggedIn: false,
				refCode: payload.refCode,
			};
		case REGISTER_FAIL:
			return {
				...state,
				isLoggedIn: false,
			};
		case RESENDCODE_SUCCESS:
			return {
				...state,
				isLoggedIn: false,
				refCode: payload.refCode,
			};
		case RESENDCODE_FAIL:
			return {
				...state,
				isLoggedIn: false,
			};
		case LOGOUT:
			return {
				...state,
				isLoggedIn: false,
				user: null,
			};
		default:
			return state;
	}
}
