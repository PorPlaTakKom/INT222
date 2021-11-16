import axios from "axios";
import querystring from "querystring";
import api from "./api";
const API_URL = "https://www.tarkom-projects.com/api/v1/";

class UserService {

  getUserDetail(accountCode) {
    return axios.get(API_URL + "user/" + accountCode);
  }

  sendEditProfileInfo(data, accountCode) {
    var formData = new FormData();
    const editform = JSON.stringify(data);
    formData.append("buyerDetailForm", editform);
    return axios.put(API_URL + "user/" + accountCode + "/detail", formData);
  }

  sendEditAddress(address, accountCode) {
    const data = querystring.stringify({
      address: address,
    });
    return axios.put(API_URL + "user/" + accountCode + "/detail", data);
  }

  getApproveStatus(accountCode){
    return api.get("user/" + accountCode + "/promotedToSeller/status")
  }

  sendSellerInformation(data,accountCode) {
    var formData = new FormData();
    const sellerInfo = JSON.stringify(data);
    formData.append("promotedForm", sellerInfo);
    return axios.post(API_URL + "user/"+accountCode+"/promotedToSeller", formData);
  }

  sendSellerImage(img) {
    var imgFormData = new FormData();
    for (let i = 0; i < img.length; i++) {
      imgFormData.append("images", img[i], img[i].name);
    }
    return axios.post(API_URL + "image/evidence/upload", imgFormData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }

  AddCard(card,accCode){
    var formData = new FormData();
    const cardJson = JSON.stringify(card);
    formData.append("cardForm", cardJson);
    return api.post( "payment/" + accCode + "/addCard", formData)
  }

  CheckCard(accCode){
    return api.get( "payment/" + accCode + "/isCard")
  }

  DelCard(accCode){
    return api.delete(`/payment/${accCode}/deleteCard`)
  }

  getCardData(accCode){
    return api.get( "payment/" + accCode)
  }

  pay(accCode, prod, key){
    var formData = new FormData();
    formData.append('accountCode',accCode)
    if( key === 'checkoutList'){
      formData.append('checkoutList',prod)
    }else {
      formData.append('itemForm',JSON.stringify(prod))
      console.log(JSON.stringify(prod))
    }
    return api.post( "payment/checkout", formData)
  }

  getWallet(accCode){
    return api.get( `payment/${accCode}/checkWallet`)
  }

  topUp(data){
    var formData = new FormData();
    formData.append('topUpForm',JSON.stringify(data))
    return api.post('payment/topUp',formData)
  }
}

export default new UserService();
