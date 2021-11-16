import api from "./api";
import AuthService from "./AuthService";

class ProdService{
	getProdToEdit(prodCode){
		let token = localStorage.getItem("user")
		const accCode = AuthService.deCodeJwt(JSON.parse(token)).accountCode
		return api.get("product/list/" + accCode + "/" + prodCode)
	}
	getAllBrandColors(){
		return api.get("brand/color/");
	}
	getBrandColors(brand){
		return api.get("brand/color/" + brand);
	}
	getProdByProdCode(code) {
		return api.get("product/" + code);
	}
	getAllProd() {
		return api.get("product");
	}
	getProd(queryParams) {
		return api.get("product", {
			params: queryParams
		});
	}
	getProdSeller(accountCode) {
		return api.get("shop/"+accountCode);
	}
	getCart(code) {
		return api.get("cart/"+code);
	}
	uploadProd(prod, prodDetail) {
		var formData = new FormData();
		const pordJson = JSON.stringify(prod);
		const pordDetailJson = JSON.stringify(prodDetail);
		formData.append("form", pordJson);
		formData.append("formDetail", pordDetailJson);
		return api.post("product", formData);
	}

	upDateProd(prodName, prodDetail) {
		let formData = new FormData();
		let token = localStorage.getItem("user")
		const accCode = AuthService.deCodeJwt(JSON.parse(token)).accountCode
		const prods = {
			sellerCode : accCode,
			prodName : prodName,
			productDetailFormList: prodDetail
		}
		const DetailJson = JSON.stringify(prods);
		formData.append("formDetail", DetailJson);
		return api.put("product/", formData);
	}

	uploadCart(cart){
		var formData = new FormData();
		const cartJson = JSON.stringify(cart)
		formData.append("addToCartForm", cartJson)
		return api.put("cart", formData);
	}
	updateCart(cart){
		var formData = new FormData();
		const cartJson = JSON.stringify(cart)
		formData.append("removeFromCart", cartJson)
		return api.patch("cart", formData);
	}
	getProfile(shopName){
		return api.get(`shop/${shopName}/profile`)
	}
	getShopPord(shopName){
		return api.get(`shop/${shopName}/product`)
	}
	deleteProdDetail(prodDetailCode){
		let formData = new FormData();
		const JsonDel = JSON.stringify(prodDetailCode)
		formData.append('deleteProdDetailForm', JsonDel)
		return api.delete('product/detail', {data: formData})
	}

	deleteProd(prodCode){
		let formData = new FormData();
		const JsonDel = JSON.stringify(prodCode)
		formData.append('deleteProdForm', JsonDel)
		return api.delete('product', {data: formData})
	}
}

export default new ProdService();
