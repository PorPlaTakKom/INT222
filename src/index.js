import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import configureStore from './configureStore';
import {Provider} from 'react-redux';
import setupInterceptors from "./services/setupInterceptors";
ReactDOM.render(
	<Provider store={configureStore}>
		<App/>
	</Provider>,
	document.getElementById('root')
);
setupInterceptors(configureStore)

reportWebVitals();
