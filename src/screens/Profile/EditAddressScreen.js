import React from "react";
import AuthService from "../../services/AuthService";
import UserService from "../../services/UserService";
import {connect} from "react-redux";
import { editAddress } from "../../actions/user/editProfile";
import Alert from "../../services/Alert";

class EditAddressScreen extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			isLoading: false,
			isBack: false,
			isRedirect: false,
			prodImage: [],
			prodImageShow: [],
			username: "",
			firstName: "",
			lastName: "",
			email: "",
			phoneNumber: "",
			user_msg: "",
			email_msg: "",
			address: "",
			accountCode: "",
		};
	}

	async componentDidMount() {
		await this.getUser();
		await this.getUserDetail();
	}

	componentWillUnmount() {
		this.setState = (state, callback) => {
			return;
		};
	}

	getUser() {
		let {user} = this.props;
		this.setState({isLoading: true});
		user = AuthService.deCodeJwt(user);
		if (user) {
			this.setState({
				accountCode: user.accountCode,
			});
		} else {
			this.setState({isLoading: false});
		}
	}

	handleAddress(e) {
		this.setState({address: e.target.value});
	}

	// handleSubmit(e) {
	// 	e.preventDefault();
	// 	const {address, accountCode} = this.state;
	// 	UserService.sendEditAddress(address, accountCode).then(res => {
	// 			this.setState({address: res.data.address});
	// 		},
	// 		(error) => {
	// 			console.log(error);
	// 		}
	// 	);
	// }

	handleSubmit(e) {
		e.preventDefault();
		const { address, accountCode } = this.state;
	
		const { dispatch } = this.props;
	
		this.setState({ isLoading: true });
		dispatch(editAddress(address, accountCode))
		  .then(() => {
				Alert.getGeneralAlertMsg('success', 'Update Address Success!!')
		  })
		  .catch(() => {
			const { message } = this.props;
			this.setState({ isLoading: false });
			if (message.status === 500) {
			  Alert.getGeneralAlertMsg("error", "Fail", message.error_message);
			} else {
			  Alert.getGeneralAlertMsg("error", "Fail", "Something when wrong");
			}
		  });
	  }

	getUserDetail() {
		UserService.getUserDetail(this.state.accountCode).then((res) => {
			if(res.data.address){
				this.setState({address: res.data.address})
			}
		});
	}

	renderEditAddressInfo() {
		return (
			<form onSubmit={this.handleSubmit.bind(this)} className="flex flex-col h-full w-full p-10 space-y-5">
				<div>
					<p className="font-PoppinsMedium text-primary">Edit Address</p>
				</div>
				<hr/>
				<div className="flex flex-col w-full h-full justify-center items-center">
					<div className="w-full h-full justify-start">
						<label htmlFor="address">
							<p className="font-PoppinsMedium text-slight">Address</p>
						</label>
						<textarea
							className="pl-2 border-2 border-gray-300 font-PoppinsMedium resize-none focus:outline-none w-full md:h-72 h-40"
							id="address"
							name="address"
							value={this.state.address}
							onChange={this.handleAddress.bind(this)}
							rows="5"
						/>
					</div>
				</div>
				<div className="flex flex-col w-full justify-center items-center">
					<button
						type="submit"
						className="bg-blue-500 hover:bg-blue-600 h-10 w-16 rounded-md font-PoppinsMedium text-white"
					>
						Save
					</button>
				</div>
			</form>
		);
	}

	render() {
		return this.renderEditAddressInfo();
	}
}

function mapStateToProps(state) {
	const {user} = state.auth;
	return {
		user,
	};
}

export default connect(mapStateToProps)(EditAddressScreen);
