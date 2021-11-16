import { combineReducers } from "redux";
import auth from "./auth";
import message from "./message";
import image from "./image";
import cart from "./cart"
import prod_seller from "./prod_seller";
import prod from "./prod";
import prodPreview from "./prodPreview";
import colorList from "./colorList";
import card from "./card";
export default combineReducers({
  auth,
  message,
  image,
  cart,
  prod_seller,
  prodPreview,
  colorList,
  prod,
  card
});
