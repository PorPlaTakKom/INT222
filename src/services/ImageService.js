import axios from "axios";
import querystring from "querystring";

const API_URL = "https://www.tarkom-projects.com/api/v1/";

class ImageService {
	changeImgaeProfile(img, accountcode) {
		const data = querystring.stringify({
			imgName: img
		});
		// var imgProfile = new FormData();
		//
		// imgProfile.append("imageName", img);
		return axios.put(API_URL + "user/" + accountcode + "/detail", data);
	}

	uploadImageProfile(img) {
		var imgFormData = new FormData();
		imgFormData.append("image", img, img.name);
		return axios.post(API_URL + "image/profile/upload", imgFormData, {
			headers: {
				"Content-Type": "multipart/form-data",
			},
		});
	}

	getImage(name) {
		return  axios.get(API_URL + "image/" + name, {
			responseType: "arraybuffer",
		});
	}

	uploadImage(img) {
		var imgFormData = new FormData();
		for (let i = 0; i < img.length; i++) {
			imgFormData.append("images", img[i], img[i].name);
		}
		return axios.post(API_URL + "image/product/upload", imgFormData, {
			headers: {
				"Content-Type": "multipart/form-data",
			},
		});
	}
}
export default new ImageService();
