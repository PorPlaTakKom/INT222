import React, {Component} from 'react';
import {getimage, removeimage} from "../actions/image/image";
import {connect} from "react-redux";
import loading_cat from "../assets/images/loading_cat.gif";

class ImgProd extends Component {
	constructor(props) {
		super(props);
		this.state = {
			imageList: [],
			prodDetail: props.prodDetail,
			color: props.color ? props.color : null,
			imgCount: 0,
			isLoading: false
		}
	}

	async componentDidMount() {
		await this.fetchData()
		await this.fetchImg(this.checkColor())
	}

	componentDidUpdate(prevProps, prevState, snapshot) {
		if (prevProps.color !== this.props.color) {
			this.setState({isLoading: true})
			this.setState({color: this.props.color, imgCount: 0})
			this.fetchImg(this.checkColor())
		}
	}

	componentWillUnmount() {
		this.setState = (state, callback) => {
			return;
		};
	}

	fetchData() {
		this.setState({isLoading: true})
		const {prodDetail} = this.state
		prodDetail.forEach(e => {
			const {colorName, imageList} = e
			this.setState(p => ({
				imageList: [...p.imageList, {
					colorName: colorName,
					imageName: imageList
				}]
			}))
		})
	}

  fetchImg(image) {
		const {dispatch} = this.props
	  dispatch(removeimage())
		if (image) {
			dispatch(getimage(image)).then( () =>{
					this.setState({isLoading: false})})
		} else {
			this.setState({isLoading: false})
		}
	}

	checkColor() {
		const {imageList} = this.state
		let result = [];
		imageList.forEach(r => {
			if (r.colorName === this.props.color) {
				result = r.imageName;
			}
		})
		return result
	}

	prevImg() {
		let {imgCount} = this.state
		if (imgCount - 1 >= 0) {
			this.setState({imgCount: --imgCount})
		}
	}

	nextImg() {
		let {imgCount} = this.state
		let {img_list} = this.props
		if (imgCount < img_list.length - 1) {
			this.setState({imgCount: ++imgCount})
		}
	}

	renderProdImg() {
		let {imgCount} = this.state
		const {img_list} = this.props
		return (
			<div className="relative flex items-center w-5/6 h-3/5 space-x-3">
				<span
					className={"material-icons cursor-pointer text-3xl" + (imgCount === 0 ? (img_list.length - 1 === 0 ? " hidden" : " text-gray-500") : "")}
					onClick={this.prevImg.bind(this)}>chevron_left</span>
				<div className="flex w-full h-full">
					<img className="w-full h-full object-scale-down" src={img_list[imgCount]} alt='prodImg'/>
				</div>
				<span
					className={"material-icons cursor-pointer text-3xl" + (imgCount === img_list.length - 1 ? (img_list.length - 1 === 0 ? " hidden" : " text-gray-500") : "")}
					onClick={this.nextImg.bind(this)}>chevron_right</span>
			</div>
		);
	}

	render() {
		const {isLoading} = this.state
		return (
			isLoading ?
				<div className="flex w-full h-full justify-center items-center">
					<img src={loading_cat} className="w-20 h-20" alt="Loading"/>
				</div>
				:
				<div className="flex w-full h-full">
					<div className="flex w-full h-full justify-center items-center">
						<div className="flex w-full h-full justify-center items-center">
							{
								this.renderProdImg()
							}
						</div>
					</div>
				</div>
		);
	}
}

function mapStateToProps(state) {
	const {img_list} = state.image;
	return {
		img_list
	};
}

export default connect(mapStateToProps)(ImgProd);
