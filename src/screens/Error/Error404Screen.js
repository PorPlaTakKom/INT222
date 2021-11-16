import React, {Component} from 'react';
import bg1 from "../../assets/images/404.gif"
import bg2 from "../../assets/images/404_2.gif"
class Error404Screen extends Component {
	render() {
		return (
			<div className="flex flex-col w-screen h-screen justify-center items-center">
				<img src={(Math.floor(Math.random() * 10) > 5) ? bg1 : bg2} alt='gif' className="absolute w-full h-full"/>
				<p className="font-PoppinsMedium text-7xl z-40 text-white">Error 404</p>
				<p className="font-PoppinsMedium text-3xl z-40 text-white">PageNotFound</p>
			</div>
		);
	}
}

export default Error404Screen;
