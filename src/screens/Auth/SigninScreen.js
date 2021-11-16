import React from "react";
import FromCard from "../../components/FormCard";
import Alert from "../../services/Alert";
import Validate from "../../components/Validate";
import {connect} from "react-redux";
import {signin} from "../../actions/auth/auth";
import cat from "../../assets/images/nyan-cat.gif";
import {Redirect} from "react-router-dom";
import logo from "../../assets/images/suesi_logo_2.png"

class SigninScreen extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			username: "",
			password: "",
			isLoading: false,
			user_msg: "",
			pass_msg: "",
			error_msg: "",
			isRedirect: false
		};
	}

	componentDidMount() {
		this.getSearchParams();
		this.checkLogin()
	}

	checkLogin(){
		const { isLoggedIn } = this.props
		if(isLoggedIn){
			this.setState({isRedirect: true})
		}
	}

	onChangeUsername(e) {
		let user = e.target.value;
		this.setState({username: user});
		this.setState({error_msg: ""});
		if (Validate.getValidateInput(user)) {
			this.setState({user_msg: ""});
		} else {
			this.setState({
				user_msg: "Username must be more 1 characters and no spaces.",
			});
		}
	}

	onChangePassword(e) {
		let pass = e.target.value;
		this.setState({password: pass});
		this.setState({error_msg: ""});
		if (Validate.getValidateInput(pass)) {
			this.setState({pass_msg: ""});
		} else {
			this.setState({
				pass_msg: "Password must be more 1 characters and no spaces.",
			});
		}
	}

	handleSignIn(e) {
		e.preventDefault();

		this.setState({
			isLoading: true,
		});

		const {username, password} = this.state;
		const {dispatch} = this.props;

		if (
			Validate.getValidateInput(this.state.username) &&
			Validate.getValidateInput(this.state.password)
		) {
			 dispatch(signin(username, password))
				.then(async () => {
					await this.setState({isLoading: false})
					await Alert.getLoginAlert()
					await this.setState({isRedirect: true})
				},() =>{
					Alert.getLoginAlertFail()
					this.setState({isLoading: false})
				})
		} else {
			this.setState({error_msg: "Invalid information.", isLoading: false});
		}
	}

	componentWillUnmount() {
		this.setState = (state, callback) => {
			return;
		};
	}

	handleForgotPassword() {
		Alert.getAlertPassword();
	}

	getSearchParams() {
		const urlSearchParams = new URLSearchParams(window.location.search);
		const params = Object.fromEntries(urlSearchParams.entries());
		if (params.user) {
			Alert.getGeneralAlertMsg(
				"success",
				"User : " + params.user + "\n was activated",
				"",
				1100
			);
		}
	}

	renderFrom() {
		return (
			<div className="flex justify-center items-center w-screen h-auto">
				<FromCard
					width={"35%"}
					height={"85%"}
					className="pb-10 pt-10"
					borderRadius={"5px"}
				>
					<div className="flex justify-center items-center w-screen h-full ">
						<div className="flex flex-col w-full justify-center items-center">
							<div className="flex w-full h-1/6 justify-center items-center">
								<p className="text-header font-PoppinsBold text-center mb-8">
									Welcome Back!
								</p>
							</div>

							<form
								className="flex flex-col w-full h-full"
								onSubmit={this.handleSignIn.bind(this)}
							>
								<div className=" flex flex-col w-full space-y-4 items-center ">
									<input
										className={
											"pl-2 border-gray-300 border-2 rounded-sm w-5/6 h-10 focus:outline-none hover:border-blue-300 md:w-8/12 " +
											(this.state.username
												? this.state.user_msg
													? "border-red-300"
													: "border-blue-300"
												: this.state.user_msg
													? "border-red-300"
													: "border-gray-300")
										}
										placeholder="Username"
										type="text"
										value={this.state.username}
										onChange={this.onChangeUsername.bind(this)}
										name="username"
									/>
									<div
										className={
											"w-5/6 md:w-8/12 justify-start items-center" +
											(this.state.user_msg ? " flex" : " hidden")
										}
									>
										<p className="text-small font-PoppinsMedium text-red-500">
											{this.state.user_msg}
										</p>
									</div>
									<input
										className={
											"pl-2 border-gray-300 border-2 rounded-sm w-5/6 h-10 focus:outline-none hover:border-blue-300 md:w-8/12 " +
											(this.state.password
												? this.state.pass_msg
													? "border-red-300"
													: "border-blue-300"
												: this.state.pass_msg
													? "border-red-300"
													: "border-gray-300")
										}
										placeholder="Password"
										type="password"
										value={this.state.password}
										onChange={this.onChangePassword.bind(this)}
										name="password"
									/>
								</div>
								<div className="flex flex-row w-5/6 h-5 mt-2 mx-auto md:w-8/12">
									<div className="flex w-3/6 justify-start">
										<p className="text-small font-PoppinsMedium text-red-500">
											{this.state.pass_msg}
											{this.state.error_msg}
										</p>
									</div>
									<div className="flex w-3/6 justify-end">
										<p
											className="text-small font-Poppins text-gray-400 hover:text-blue-700 cursor-pointer"
											onClick={this.handleForgotPassword}
										>
											Forgot password?
										</p>
									</div>
								</div>

								<div className="flex w-full justify-center mt-10">
									<button
										className="w-5/6 h-10 bg-blue-400 hover:bg-white text-white hover:text-blue-400 border-2 border-blue-400 font-PoppinsMedium focus:outline-none md:w-8/12"
										type="submit"
										name="signIn"
									>
										Sign In
									</button>
								</div>
								<div className="flex flex-row w-10/12 md:w-8/12 mx-auto justify-center mt-5">
									<div className="flex w-1/3 justify-center items-center mx-auto">
										<hr className="flex w-full h-0.5 bg-gray-400"/>
									</div>
									<div className="flex w-2/3 justify-center">
										<p className="text-small md:text-slight font-PoppinsMedium">
											Don’t have an account?
										</p>
									</div>
									<div className="flex w-1/3 justify-center items-center mx-auto">
										<hr className="flex w-full h-0.5 bg-gray-400"/>
									</div>
								</div>
								<div className="flex w-full justify-center mt-5 mb-2">
									<div
										onClick={() => this.props.history.push("/signup")}
										className="flex justify-center items-center w-5/6 h-10 bg-white border-2 border-blue-400 hover:text-white text-blue-400 hover:border-blue-400 bg-none hover:bg-blue-400 md:w-8/12 cursor-pointer"
									>
										<p className="font-PoppinsMedium text-primary cursor-pointer">
											Create your account
										</p>
									</div>
								</div>
							</form>
						</div>
					</div>
				</FromCard>
			</div>
		);
	}

	renderHeader() {
		return (
			<div onClick={() => this.props.history.push("/home")} className=" mt-16 md:mt-0 w-full h-full flex justify-center items-center">
				{/*<p className="font-PoppinsBold text-header">LOGO</p>*/}
				<img src={logo} alt="logo" className="w-auto h-32 cursor-pointer"/>
			</div>
		);
	}

	render() {
		const {isRedirect, isLoading} = this.state;
		return (
			isRedirect ?
			<Redirect to="profile"/>
				:
				<div className="flex flex-col items-center w-screen h-mobile md:h-screen">
					<div className={"absolute w-screens h-screens justify-center items-center" + (isLoading ? " flex" : " hidden")}>
						<div className="flex flex-col w-screen h-screen bg-black bg-opacity-20 transition-opacity justify-center items-center">
							<div className="flex">
								<img src={cat} alt="cat" className="flex justify-center items-center m-auto"/>
							</div>
						</div>
					</div>
					<div className="flex w-full h-1/6 justify-center items-center min-h-header">
						{this.renderHeader()}
					</div>
					<div
						className="flex w-full h-4/6 items-center justify-center min-w-full min-h-mobile md:min-h-desktop md:bg-gray-50">
						{this.renderFrom()}
					</div>
					<div className="flex w-full h-1/6 justify-center items-center min-h-footer">
						<p className="text-medium font-Poppins">
							Copyright © 2021 ยังไม่คิด.COM. All Rights Reserved.
						</p>
					</div>
				</div>
			);
		}
}

function mapStateToProps(state) {
	const {isLoggedIn} = state.auth;
	const {message} = state.message;
	return {
		isLoggedIn,
		message,
	};
}

export default connect(mapStateToProps)(SigninScreen);
