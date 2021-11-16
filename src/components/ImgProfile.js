import React from "react";
import AuthService from "../services/AuthService";
import ImageService from "../services/ImageService";
import {connect} from "react-redux";
import {uploadProfileimage} from "../actions/image/image";
import UserService from "../services/UserService";
import TopUp from "./TopUp";

class ImgProfile extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			isLoading: false,
			currentProfileImg: null,
			isMouseHover: false,
			previewImage: undefined,
			accountCode: undefined,
			isChangeImg: props.isChangeImg ? props.isChangeImg : false,
			tempImg: undefined,
			wallet: 0,
			isTopUp: false,
		};
	}

	async componentDidMount() {
		await this.getUser();
	}

	componentWillUnmount() {
		this.setState = (state, callback) => {
			return;
		};
	}

	async getUser() {
		let {user} = this.props;
		user = AuthService.deCodeJwt(user);
		if (user) {
			await this.setState({isLoading: true})
			ImageService.getImage(user.img).then( async res => {
				await this.setState({
					currentProfileImg: "data:image/*;base64," + Buffer(res.data, "binary").toString("base64"),
					username: user.user,
					email: user.email,
					roles: user.roles[0],
					accountCode: user.accountCode,
					tempImg: "data:image/*;base64," + Buffer(res.data, "binary").toString("base64"),
				})
				UserService.getWallet(user.accountCode).then(res =>{
					this.setState({wallet: res.data.wallet, isLoading:false})
				})
			})
		}
	}

	onCancel(){
			this.setState({
				currentProfileImg: this.state.tempImg,
				previewImage: null,
			})
	}

	renderProfileImg() {
		const {username, roles, currentProfileImg, isMouseHover, previewImage, isChangeImg, wallet, isTopUp} = this.state
		return (
			<div className="flex w-full h-full p-5">
				{
					isTopUp ? <div className="absolute w-screen h-screen bg-gray-800 bg-opacity-50 left-0 top-0 z-50">
						<div className="flex w-full h-full items-center justify-center">
							<TopUp Money={ m => this.setState({wallet: m})} onChange={data=> this.setState({isTopUp:data.isClose})}/>
						</div>
					</div>
						: null
				}
				<div className="flex flex-col w-full h-2/6">
					<div className="flex w-full h-full justify-center">
						<img className="absolute flex h-48 w-48 rounded-full object-cover"
						     src={previewImage ? previewImage : currentProfileImg}
						     alt="ProfileImage"
						     onMouseOver={() => this.setState({isMouseHover: true})}
						/>
						<label htmlFor="image-upload"
						       className={"relative w-full h-full justify-center" + ((isMouseHover) ? (isChangeImg ? " flex" : " hidden") : " hidden")}>
							<span
								className={"absolute h-48 w-48 rounded-full bg-black bg-opacity-25 transition-opacity"}
								onMouseLeave={() => this.setState({isMouseHover: false})}>
							<p className="relative flex justify-center items-center w-full h-full font-PoppinsMedium text-white cursor-pointer">Change Image</p>
						</span>
						</label>
						<input type="file" name="image-upload" id="image-upload" accept="image/png,image/jpeg"
						       onChange={this.onChangeImg.bind(this)} hidden/>
					</div>
					<div className="mt-52 flex flex-col text-center">
						<p className="font-PoppinsBold text-primary uppercase">{username}</p>
						<p className="font-PoppinsBold text-primary uppercase">{roles}</p>
						<span className="flex justify-center items-center font-PoppinsBold text-medium lg:text-primary uppercase">
							Money : {wallet} <span className="ml-2 text-small bg-blue-400 rounded-md text-white w-14 cursor-pointer" onClick={()=> this.setState({isTopUp:true})}>TopUp</span>
						</span>
					</div>
					<div className="flex flex-row items-center w-full mt-3 ">
						<div className="flex w-1/2 justify-center items-center ">
							<span className={"flex justify-center items-center font-PoppinsMedium text-primary bg-yellow-500 hover:bg-yellow-700 w-20 h-8 rounded-md text-white cursor-pointer" + (previewImage ? "" : " hidden")} onClick={this.onCancel.bind(this)}>
								Cancel
							</span>
						</div>
						<div className="flex w-1/2 justify-center items-center">
							<span className={"flex justify-center items-center font-PoppinsMedium text-primary bg-green-400 hover:bg-green-600 w-20 h-8 rounded-md text-white cursor-pointer" + (previewImage ? "" : " hidden")} onClick={this.onUploadImg.bind(this)}>
								Save
							</span>
						</div>
					</div>
				</div>
			</div>
		)
	}

	onChangeImg(e) {
		this.setState({currentProfileImg: e.target.files[0]});
		const reader = new FileReader();
		reader.onload = () => {
			if (reader.readyState === 2) {
				this.setState({previewImage: reader.result});
			}
		};
		if (e.target.files[0]) {
			reader.readAsDataURL(e.target.files[0]);
		}
		e.target.value = "";
	}

	onUploadImg() {
		const {dispatch} = this.props;
		dispatch(uploadProfileimage(this.state.currentProfileImg)).then(res => {
			const {img_name} = this.props
			ImageService.changeImgaeProfile(img_name, this.state.accountCode).then(async res => {
				await localStorage.removeItem("user");
				await localStorage.setItem("user", JSON.stringify(res.data));
				await this.getUser();
				await window.location.reload();
			})
		})
	}

	render() {
		const {isLoading} = this.state
		return (
			isLoading ?
				<div className="flex flex-col w-full h-full p-5">
					<div className="flex flex-col w-full h-full items-center space-y-3">
						<span className={"flex h-48 w-48 justify-center rounded-full bg-gray-300 animate-pulse"}/>
						<div className="space-y-3">
							<span className={"flex h-7 w-32 justify-center rounded-full bg-gray-300 animate-pulse"}/>
							<span className={"flex h-7 w-32 justify-center rounded-full bg-gray-300 animate-pulse"}/>
							<span className={"flex h-7 w-32 justify-center rounded-full bg-gray-300 animate-pulse"}/>
						</div>
					</div>
				</div>
				:
				this.renderProfileImg()
		)
	}
}

function mapStateToProps(state) {
	const {user} = state.auth;
	const {img_name} = state.image;
	return {
		user,
		img_name
	};
}

export default connect(mapStateToProps)(ImgProfile);
