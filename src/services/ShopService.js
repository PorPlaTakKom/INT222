import api from "./api";
const API_URL = "https://www.tarkom-projects.com/api/v1/";

class ShopService {
  sendBasicShopInformation(data, accountCode) {
    var formData = new FormData();
    const shopInfo = JSON.stringify(data);
    formData.append("setupShopFrom", shopInfo);
    return api.post("shop/" + accountCode + "/setup", formData);
  }
  getProductInShop(shopName) {
    return api.get(
      API_URL +
        "shop/" +
        shopName +
        "/product?pageSize=1&pageNo=1&orderBy=decending&sortBy=brand"
    );
  }
}
export default new ShopService();
