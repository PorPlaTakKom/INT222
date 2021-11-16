import {
	UPLOADPRODUCT_SUCCESS,
	UPLOADPRODUCT_FAIL,
	SET_MESSAGE, GETPRODUCTSELLER, GETAllPRODUCTS_SUCCESS
} from "../types";
import ProdService from "../../services/ProdService";

export const uploadprod = (prod, prodDetail) => (dispatch) => {
	return ProdService.uploadProd(prod, prodDetail).then((res) => {
		dispatch({
			type: UPLOADPRODUCT_SUCCESS,
			payload: {status: res.status},
		})

		dispatch({
			type: SET_MESSAGE,
			payload: "UPLOAD SUCCESS!",
		});

		return Promise.resolve();

	}, (error) => {
		const message =
			(error.response &&
				error.response.data &&
				error.response.data.message) ||
			error.message ||
			error.toString();

		dispatch({
			type: UPLOADPRODUCT_FAIL,
			payload: error.response,
		});

		dispatch({
			type: SET_MESSAGE,
			payload: message,
		});

		return Promise.reject();
	})
}

export const getProd = (queryParams) => (dispatch) =>{
	return ProdService.getProd().then((res) => {
		dispatch({
			type: UPLOADPRODUCT_SUCCESS,
			payload: {status: res.status},
		})

		dispatch({
			type: SET_MESSAGE,
			payload: "UPLOAD SUCCESS!",
		});

		return Promise.resolve();

	}, (error) => {
		const message =
			(error.response &&
				error.response.data &&
				error.response.data.message) ||
			error.message ||
			error.toString();

		dispatch({
			type: UPLOADPRODUCT_FAIL
		});

		dispatch({
			type: SET_MESSAGE,
			payload: message,
		});

		return Promise.reject();
	})
}

export const getProdSeller = (accountCode) => (dispatch) =>{
	return ProdService.getProdSeller(accountCode).then((res) => {
		dispatch({
			type: GETPRODUCTSELLER,
			payload: {prod_seller: res.data},
		})
		return Promise.resolve();
	})
}

export const getAllProd = () => (dispatch) =>{
	return ProdService.getAllProd().then((res) => {
		dispatch({
			type: GETAllPRODUCTS_SUCCESS,
			payload: {all_prod: res.data},
		})
		return Promise.resolve();
	})
}
