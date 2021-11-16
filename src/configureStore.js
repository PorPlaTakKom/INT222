import {createStore, applyMiddleware} from "redux";
import {composeWithDevTools} from "redux-devtools-extension";
import thunk from "redux-thunk";
import rootReducer from "./reducers";
import logger from 'redux-logger'

const middleware = [thunk];

const store = createStore(
	rootReducer,
	composeWithDevTools(applyMiddleware(...middleware, logger))
);

export default store;
