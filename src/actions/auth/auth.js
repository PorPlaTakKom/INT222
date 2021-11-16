import {
	LOGIN_SUCCESS,
	LOGIN_FAIL,
	REGISTER_SUCCESS,
	REGISTER_FAIL,
	RESENDCODE_SUCCESS,
	RESENDCODE_FAIL,
	SET_MESSAGE,
	LOGOUT, CLEAR_CART, REFRESH_TOKEN
} from "../types";

import AuthService from "../../services/AuthService";
import Alert from "../../services/Alert";

export const signin = (username, password) => (dispatch) => {
	return AuthService.signin(username, password).then(
		(data) => {
			dispatch({
				type: LOGIN_SUCCESS,
				payload: {user: data},
			})
			return Promise.resolve();
		},
		(error) => {
			const message =
				(error.response &&
					error.response.data &&
					error.response.data.message) ||
				error.message ||
				error.toString();

			dispatch({
				type: LOGIN_FAIL,
			});

			dispatch({
				type: SET_MESSAGE,
				payload: message,
			});

			return Promise.reject();
		}
	);
};

export const signup = (username, email, password) => (dispatch) => {
	return AuthService.register(username, email, password).then(
		async (response) => {
			dispatch({
				type: REGISTER_SUCCESS,
				payload: {refCode: response.data.refCode}
			});

			dispatch({
				type: SET_MESSAGE,
				payload: response.data.message,
			});
			await Alert.getRegisterAlert();
			return await Promise.resolve();
		},
		(error) => {
			const message = {
				status: error.response.status,
				error_message: error.response.data.errorMsg
			}
			dispatch({
				type: REGISTER_FAIL,
			});

			dispatch({
				type: SET_MESSAGE,
				payload: message,
			});

			return Promise.reject();
		}
	);
};

export const resencode = (username) => (dispatch) => {
	return AuthService.resendActivationCode(username).then((response) => {
		const message = response.data.msg
		dispatch({
			type: RESENDCODE_SUCCESS,
			payload: {refCode: response.data.refCode}
		});

		dispatch({
			type: SET_MESSAGE,
			payload: message
		});

		return Promise.resolve();
	}, (error) => {
		const message = error.response

		dispatch({
			type: RESENDCODE_FAIL,
		});

		dispatch({
			type: SET_MESSAGE,
			payload: message,
		});
		return Promise.reject();
	});
};

export const logout = () => (dispatch) => {
	AuthService.logout()
	dispatch({
		type: LOGOUT,
	});
	dispatch({
		type: CLEAR_CART,
	});
};

export const refreshToken = (accessToken) => (dispatch) => {
	dispatch({
		type: REFRESH_TOKEN,
		payload: accessToken,
	})
}


