import {
  SENDEDITPROFILE_SUCCESS,
  SENDEDITPROFILE_FAIL,SENDEDITADDRESS_SUCCESS,SENDEDITADDRESS_FAIL,
  SET_MESSAGE,
} from "../types";
import AuthService from "../../services/UserService";

export const editForm = (data, accountCode) => (dispatch) => {

    return AuthService.sendEditProfileInfo(
      data,
      accountCode
    ).then(
      async (response) => {
        localStorage.setItem('user',JSON.stringify(response.data))
        dispatch({
          type: SENDEDITPROFILE_SUCCESS,
          payload: { status: response.status },
        });
        dispatch({
          type: SET_MESSAGE,
          payload: "EDIT SUCCESS!",
        });
        return await Promise.resolve();
      },
      (error) => {
        const message = {
          status: error.response.status,
          error_message: error.response.data.errorMsg,
        };
        dispatch({
          type: SENDEDITPROFILE_FAIL,
        });

        dispatch({
          type: SET_MESSAGE,
          payload: message,
        });

        return Promise.reject();
      }
    );
  };


  export const editAddress = (address, accountCode) => (dispatch) => {
 
    return AuthService.sendEditAddress(
      address,
      accountCode
    ).then(
      async (response) => {
        dispatch({
          type: SENDEDITADDRESS_SUCCESS,
          payload: { status: response.status },
        });
        dispatch({
          type: SET_MESSAGE,
          payload: "EDIT SUCCESS!",
        });
        return await Promise.resolve();
      },
      (error) => {
        const message = {
          status: error.response.status,
          error_message: error.response.data.errorMsg,
        };
        dispatch({
          type: SENDEDITADDRESS_FAIL,
        });

        dispatch({
          type: SET_MESSAGE,
          payload: message,
        });

        return Promise.reject();
      }
    );
  };
