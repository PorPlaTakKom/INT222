import {
	UPLOADIMAGE_SUCCESS,
	UPLOADIMAGE_FAIL,
	SET_MESSAGE,
	UPLOADPPROFILEIMG_SUCCESS,
	UPLOADPPROFILEIMG_FAIL, GETIMAGE_SUCCESS, DELIMAGE_SUCCESS
} from "../types";
import ImageService from "../../services/ImageService";

export const uploadimage = (img) => (dispatch) => {
	return ImageService.uploadImage(img).then(
		(res) => {
			dispatch({
				type: UPLOADIMAGE_SUCCESS,
				payload: {img_name: res.data},
			});

			dispatch({
				type: SET_MESSAGE,
				payload: "UPLOAD SUCCESS!",
			});

			return Promise.resolve(res);
		},
		(error) => {
			const message =
				(error.response &&
					error.response.data &&
					error.response.data.message) ||
				error.message ||
				error.toString();

			dispatch({
				type: UPLOADIMAGE_FAIL,
			});

			dispatch({
				type: SET_MESSAGE,
				payload: message,
			});

			return Promise.reject();
		}
	);
};

export const uploadProfileimage = (img) => (dispatch) => {
	return ImageService.uploadImageProfile(img).then(
		(res) => {
			dispatch({
				type: UPLOADPPROFILEIMG_SUCCESS,
				payload: {img_name: res.data},
			});

			dispatch({
				type: SET_MESSAGE,
				payload: "UPLOAD SUCCESS!",
			});

			return Promise.resolve(res);
		},
		(error) => {
			const message =
				(error.response &&
					error.response.data &&
					error.response.data.message) ||
				error.message ||
				error.toString();

			dispatch({
				type: UPLOADPPROFILEIMG_FAIL,
			});

			dispatch({
				type: SET_MESSAGE,
				payload: message,
			});

			return Promise.reject();
		}
	);
};

export const getimage = (img) => async (dispatch) => {
	for (const file in img){
		const data  = await ImageService.getImage(img[file])
		dispatch({
			type: GETIMAGE_SUCCESS,
			payload: {img_list: "data:image/*;base64," + Buffer.from(data.data, 'binary').toString('base64')},
		});
	}
	return Promise.resolve()
};

export const removeimage = () => (dispatch) => {
		dispatch({
			type: DELIMAGE_SUCCESS,
			payload: {img_list: []},
		});
		return Promise.resolve()
};
