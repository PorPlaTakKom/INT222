import {
    GETPRODUCTSELLER

} from "../actions/types";

const initialState = {prod_seller: null}

export default function prod_seller(state = initialState, action) {
    const {type, payload} = action;

    switch (type) {
        case GETPRODUCTSELLER:
            return {...state, prod_seller: payload.prod_seller};
        default:
            return state;
    }

}
