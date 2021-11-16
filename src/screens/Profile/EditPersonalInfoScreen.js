import React from "react";
import { Redirect } from "react-router-dom";
import Validate from "../../components/Validate";
import AuthService from "../../services/AuthService";
import UserService from "../../services/UserService";
import { editForm } from "../../actions/user/editProfile";
import { connect } from "react-redux";
import cat from "../../assets/images/nyan-cat.gif";
import Alert from "../../services/Alert";

class EditPersonalInfoScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      isBack: false,
      isRedirect: false,
      username: "",
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      user_msg: "",
      firstName_msg: "",
      lastName_msg: "",
      email_msg: "",
      phone_msg: "",
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
    let { user } = this.props;
    this.setState({ isLoading: true });
    user = AuthService.deCodeJwt(user);
    if (user) {
      this.setState({
        username: user.user,
        accountCode: user.accountCode,
        email: user.email,
      });
    }
  }

  handleUsername(e) {
    let username = e.target.value;
    this.setState({ username: username });
    if (Validate.getValidateUsername(username)) {
      this.setState({ user_msg: "" });
    } else {
      this.setState({
        user_msg: "Username must be 3-15 characters and no spaces.",
      });
    }
  }

  handleFirstName(e) {
    let firstName = e.target.value;
    this.setState({ firstName: firstName });

    if (Validate.getValidateFirstName(firstName)) {
      this.setState({ firstName_msg: "" });
    } else {
      this.setState({
        firstName_msg:
          "The first name cannot be a number, no special characters and must not contain more than 35 characters.",
      });
    }
  }

  handleLastName(e) {
    let lastName = e.target.value;
    this.setState({ lastName: lastName });
    if (Validate.getValidateLastName(lastName)) {
      this.setState({ lastName_msg: "" });
    } else {
      this.setState({
        lastName_msg:
          "The last name cannot be a number, no special characters and must not contain more than 35 characters.",
      });
    }
  }

  handlePhoneNumber(e) {
    let phoneNumber = e.target.value;
    this.setState({ phoneNumber: phoneNumber });

    if (Validate.getValidatePhoneNumber(phoneNumber)) {
      this.setState({ phone_msg: "" });
    } else {
      this.setState({
        phone_msg:
          "Phone number much begin with 06,09,08 and not more than 10 characters.",
      });
    }
  }

  getUserDetail() {
    UserService.getUserDetail(this.state.accountCode).then((res) => {
      if (res.data != null) {
        this.setState({
          firstName: res.data.firstname ? res.data.firstname : "",
        });
        this.setState({ lastName: res.data.lastname ? res.data.lastname : "" });
        this.setState({
          phoneNumber: res.data.phoneNumber ? res.data.phoneNumber : "",
        });
        this.setState({ isLoading: false });
      }
    });
  }



  // handleSubmit(e) {
  //   e.preventDefault();
  //   this.setState({ isLoading: true });
  //   const { username, firstName, lastName, phoneNumber, accountCode } =
  //     this.state;
  //   let data = {
  //     username: username,
  //     firstname: firstName,
  //     lastname: lastName,
  //     phoneNumber: phoneNumber,
  //   };

  //   if (
  //     Validate.getValidateUsername(username) &&
  //     Validate.getValidateFirstName(firstName) &&
  //     Validate.getValidateLastName(lastName) &&
  //     Validate.getValidatePhoneNumber(phoneNumber)
  //   ) {
  //     UserService.sendEditProfileInfo(data, accountCode).then(async (res) => {
  //       await localStorage.removeItem("user");
  //       await localStorage.setItem("user", JSON.stringify(res.data));
  //       await this.getUser();
  //       await window.location.reload();
  //     });
  //   } else {
  //     this.setState({ isLoading: false });
  //   }
  // }

  handleSubmit(e) {
    e.preventDefault();
    const { username, firstName, lastName, phoneNumber, accountCode } = this.state;
    let data = {
      username: username,
      firstname: firstName,
      lastname: lastName,
      phoneNumber: phoneNumber,
    };
    const { dispatch } = this.props;
    if (
      Validate.getValidateUsername(username) &&
      Validate.getValidatePhoneNumber(phoneNumber)
    ) {
      this.setState({ isLoading: true });
        dispatch(editForm(data, accountCode))
        .then(async () => {
          this.setState({ isLoading: false });
          await Alert.getGeneralAlertMsg('success', 'Update Profile')
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
    } else {
      Alert.getGeneralAlertMsg('warning', 'Enter the information correctly')
      this.setState({ msg: "Invalid information." })
    }
  }

  renderEditPersonalInfo() {

    const { username, firstName, lastName, email, phoneNumber } = this.state;
    return (
      <form
        onSubmit={this.handleSubmit.bind(this)}
        className="flex flex-col h-full w-full p-10 space-y-5"
      >
        <div>
          <p className="font-PoppinsMedium text-primary">
            Edit Personal information
          </p>
        </div>
        <hr />
        <div className="flex flex-col w-full h-full items-center space-y-2">
          <div className="flex flex-col w-full">
            <div className="w-full justify-start mb-1">
              <label htmlFor="username">
                <p className="font-PoppinsMedium text-slight">Username</p>
              </label>
            </div>
            <input
              id="username"
              name="username"
              value={username}
              onChange={this.handleUsername.bind(this)}
              className="pl-2  border-gray-300 border-2 rounded-sm h-10 focus:outline-none hover:border-blue-300 w-full"
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
          </div>

          <div className="flex flex-col w-full ">
            <label htmlFor="firstName">
              <p className="font-PoppinsMedium text-slight">First Name</p>
            </label>
            <input
              id="firstName"
              name="firstName"
              value={firstName}
              onChange={this.handleFirstName.bind(this)}
              className=" pl-2 border-gray-300 border-2 rounded-sm h-10 focus:outline-none hover:border-blue-300 w-full"
            />
            <div
              className={
                "w-5/6 md:w-8/12 justify-start items-center" +
                (this.state.firstName_msg ? " flex" : " hidden")
              }
            >
              <p className="text-small font-PoppinsMedium text-red-500">
                {this.state.firstName_msg}
              </p>
            </div>
          </div>

          <div className="flex flex-col w-full ">
            <label htmlFor="lastName">
              <p className="font-PoppinsMedium text-slight">Last Name</p>
            </label>

            <input
              id="lastName"
              name="lastName"
              value={lastName}
              onChange={this.handleLastName.bind(this)}
              className="pl-2  border-gray-300 border-2 rounded-sm h-10 focus:outline-none hover:border-blue-300 w-full"
            />
            <div
              className={
                "w-5/6 md:w-8/12 justify-start items-center" +
                (this.state.lastName_msg ? " flex" : " hidden")
              }
            >
              <p className="text-small font-PoppinsMedium text-red-500">
                {this.state.lastName_msg}
              </p>
            </div>
          </div>

          <div className="flex flex-col w-full ">
            <label htmlFor="email">
              <p className="font-PoppinsMedium text-slight">Email</p>
            </label>
            <div className=" opacity-80 ">
              <input
                id="email"
                name="email"
                value={email}
                // onChange={this.handleEmail.bind(this)}
                readOnly
                className="bg-gray-300 cursor-default pl-2  border-gray-300 border-2 rounded-sm h-10 focus:outline-none   w-full"
              />
            </div>
          </div>

          <div className="flex flex-col w-full ">
            <label htmlFor="phoneNumber">
              <p className="font-PoppinsMedium text-slight">Phone Number</p>
            </label>
            <input
              type="number"
              id="phoneNumber"
              name="phoneNumber"
              value={phoneNumber}
              onChange={this.handlePhoneNumber.bind(this)}
              className="pl-2  border-gray-300 border-2 rounded-sm h-10 focus:outline-none hover:border-blue-300 w-full"
            />
            <div
              className={
                "w-5/6 md:w-8/12 justify-start items-center" +
                (this.state.phone_msg ? " flex" : " hidden")
              }
            >
              <p className="text-small font-PoppinsMedium text-red-500">
                {this.state.phone_msg}
              </p>
            </div>
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
    const { isBack, isLoading } = this.state;
    if (isBack) {
      return <Redirect to="/editprofile" />;
    }
    return isLoading ? (
      <div className="flex flex-col w-full h-full bg-opacity-20 transition-opacity justify-center items-center">
        <div className="flex absolute">
          <img
            src={cat}
            alt="cat"
            className="flex justify-center items-center m-auto"
          />
        </div>
      </div>
    ) : (
      this.renderEditPersonalInfo()
    );
  }
}

function mapStateToProps(state) {
  const { user } = state.auth;
  return {
    user,
  };
}

export default connect(mapStateToProps)(EditPersonalInfoScreen);
