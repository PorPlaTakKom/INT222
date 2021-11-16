import {
  UPLOADIMAGE_SUCCESS,
  UPLOADIMAGE_FAIL,
  UPLOADPPROFILEIMG_SUCCESS,
  UPLOADPPROFILEIMG_FAIL,
  GETPPROFILEIMG_SUCCESS,
  GETPPROFILEIMG_FAIL, GETIMAGE_SUCCESS, DELIMAGE_SUCCESS,
} from "../actions/types";

const initialState = { img_name: null,img_list: [] };
export default function image(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case UPLOADIMAGE_SUCCESS:
      return { ...state, img_name: payload.img_name };
    case UPLOADIMAGE_FAIL:
      return { ...state, img_name: null };
    case UPLOADPPROFILEIMG_SUCCESS:
      return { ...state, img_name: payload.img_name };
    case UPLOADPPROFILEIMG_FAIL: {
      return { ...state, img_name: null };
    }
    case GETPPROFILEIMG_SUCCESS: {
      return { ...state, img_name: payload.img_name };
    }
    case GETPPROFILEIMG_FAIL: {
      return { ...state, img_name: null };
    }
     case GETIMAGE_SUCCESS: {
      return {...state, img_list: state.img_list.concat(payload.img_list)};
    }
    case DELIMAGE_SUCCESS:{
      return { ...state, img_list: payload.img_list };
    }
    default:
      return state;
  }
}
