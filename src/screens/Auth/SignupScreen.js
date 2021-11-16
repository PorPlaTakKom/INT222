import React from "react";
import FromCard from "../../components/FormCard";
import Alert from "../../services/Alert";
import cat from "../../assets/images/nyan-cat.gif";
import ActivationScreen from "./ActivationScreen";
import Validate from "../../components/Validate";
import { signup } from "../../actions/auth/auth";
import { connect } from "react-redux";
import logo from "../../assets/images/suesi_logo_2.png"
import axios from "axios";

class SignupScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      confirmPassword: "",
      email: "",
      user_msg: "",
      pass_msg: "",
      confirm_pass_msg: "",
      email_msg: "",
      isAgreedCookie: false,
      isLoading: false,
      isCreateAccountPass: false,
    };
  }

  onChangeUsername(e) {
    let user = e.target.value;
    this.setState({ username: user });
    if (Validate.getValidateUsername(user)) {
      this.setState({ user_msg: "" });
    } else {
      this.setState({
        user_msg: "Username must be 3-15 characters and no spaces.",
      });
    }
  }

  onChangePassword(e) {
    let pass = e.target.value;
    this.setState({ password: pass });
    if (Validate.getValidatePassword(pass)) {
      this.setState({ pass_msg: "" });
    } else {
      this.setState({
        pass_msg:
          "Password must contain a-z A-Z 0-9 and special characters and no spaces.",
      });
    }
  }

  onChangeConfirmPassword(e) {
    let confirm_pass = e.target.value;
    this.setState({ confirmPassword: confirm_pass });
    if (
      Validate.getValidateConfirmPassword(this.state.password, confirm_pass)
    ) {
      this.setState({ confirm_pass_msg: "" });
    } else {
      this.setState({ confirm_pass_msg: "Passwords do not match!" });
    }
  }

  onChangeEmail(e) {
    let email = e.target.value;
    this.setState({ email: email });
    if (Validate.getValidateEmail(email)) {
      this.setState({ email_msg: "" });
    } else {
      this.setState({ email_msg: "Invalid email!" });
    }
  }

  onChangeAgreed(e) {
    this.setState({ isAgreedCookie: !this.state.isAgreedCookie });
    this.setState({ msg: "" });
  }

  CheckUsername(e){
    if(e.target.value.length > 0){
      axios.get('https://www.tarkom-projects.com/api/v1/test/hasUsername/'+e.target.value).then(res =>{
        if(res.data === true){
          this.setState({user_msg: `You can't use this username : ${this.state.username}`})
        }
      })
    }
  }

  CheckEmail(e){
    if(e.target.value.length > 0){
      axios.get('https://www.tarkom-projects.com/api/v1/test/hasEmail/'+e.target.value).then(res =>{
        if(res.data === true){
          this.setState({email_msg: `You can't use this email : ${this.state.email}`})
        }
      })
    }
  }

  handleSignUp(e) {
    e.preventDefault();

    const { dispatch } = this.props;
    if (
      this.state.isAgreedCookie &&
      Validate.getValidateUsername(this.state.username) &&
      Validate.getValidatePassword(this.state.password) &&
      Validate.getValidateConfirmPassword(
        this.state.password,
        this.state.confirmPassword
      ) &&
      Validate.getValidateEmail(this.state.email)
    ) {
      this.setState({ isLoading: true });
      dispatch(
        signup(this.state.username, this.state.email, this.state.password)
      )
        .then(() => {
          this.setState({ isLoading: false });
          this.setState({ isCreateAccountPass: true });
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
      this.setState({ msg: "Invalid information." });
    }
  }

  renderHeader() {
    return (
      <div onClick={() => this.props.history.push("/home")}>
        {/*<p className="font-PoppinsBold text-header">LOGO</p>*/}
        <img src={logo} alt="logo" className="w-auto h-32 cursor-pointer"/>
      </div>
    );
  }

  renderFrom() {
    return (
      <div className="flex justify-center items-center w-screen h-auto">
        <FromCard
          width={"35%"}
          height={"80%"}
          borderRadius={"5px"}
          className="pb-10 pt-10"
        >
          <div className="flex justify-center items-center w-screen h-full">
            <div className="flex flex-col w-full justify-center items-center">
              <div className="flex w-full h-1/6 justify-center items-center">
                <p className="text-header font-PoppinsBold text-center mb-8">
                  Register
                </p>
              </div>

              <form
                className="flex flex-col w-full h-full"
                onSubmit={this.handleSignUp.bind(this)}
              >
                <div className="flex flex-col w-full space-y-3 items-center">
                  <input
                    className={
                      "pl-2 border-2 rounded-sm w-5/6 h-10 focus:outline-none md:w-8/12 hover:border-blue-300 " +
                      (this.state.username
                        ? this.state.user_msg
                          ? "border-red-300"
                          : "border-blue-300"
                        : "border-gray-300")
                    }
                    placeholder="Username"
                    type="text"
                    value={this.state.username}
                    onChange={this.onChangeUsername.bind(this)}
                    onBlur={this.CheckUsername.bind(this)}
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
                      "pl-2 border-2 rounded-sm w-5/6 h-10 focus:outline-none md:w-8/12 hover:border-blue-300 " +
                      (this.state.password
                        ? this.state.pass_msg
                          ? "border-red-300"
                          : "border-blue-300"
                        : "border-gray-300")
                    }
                    placeholder="Password"
                    type="password"
                    value={this.state.password}
                    onChange={this.onChangePassword.bind(this)}
                    name="password"
                  />
                  <div
                    className={
                      "w-5/6 md:w-8/12 justify-start items-center" +
                      (this.state.pass_msg ? " flex" : " hidden")
                    }
                  >
                    <p className="text-small font-PoppinsMedium text-red-500">
                      {this.state.pass_msg}
                    </p>
                  </div>
                  <input
                    className={
                      "pl-2 border-gray-300 border-2 rounded-sm w-5/6 h-10 focus:outline-none md:w-8/12 hover:border-blue-300 " +
                      (this.state.password
                        ? this.state.confirm_pass_msg
                          ? "border-red-300"
                          : "border-blue-300"
                        : "border-gray-300")
                    }
                    placeholder="Confirm Password"
                    type="password"
                    value={this.state.confirmPassword}
                    onChange={this.onChangeConfirmPassword.bind(this)}
                    name="confirmPassword"
                  />
                  <div
                    className={
                      "w-5/6 md:w-8/12 justify-start items-center" +
                      (this.state.confirm_pass_msg ? " flex" : " hidden")
                    }
                  >
                    <p className="text-small font-PoppinsMedium text-red-500">
                      {this.state.confirm_pass_msg}
                    </p>
                  </div>
                  <input
                    className={
                      "pl-2 border-gray-300 border-2 rounded-sm w-5/6 h-10 focus:outline-none md:w-8/12 hover:border-blue-300 " +
                      (this.state.email
                        ? this.state.email_msg
                          ? "border-red-300"
                          : "border-blue-300"
                        : "border-gray-300")
                    }
                    placeholder="Email"
                    type="text"
                    value={this.state.email}
                    onChange={this.onChangeEmail.bind(this)}
                    onBlur={this.CheckEmail.bind(this)}
                    name="email"
                  />
                  <div
                    className={
                      "w-5/6 md:w-8/12 justify-start items-center" +
                      (this.state.email_msg ? " flex" : " hidden")
                    }
                  >
                    <p className="text-small font-PoppinsMedium text-red-500">
                      {this.state.email_msg}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col w-5/6 h-5 mt-3 mx-auto md:w-8/12">
                  <div className="flex w-full justify-start items-center">
                    <p className="text-small font-PoppinsMedium text-red-500">
                      {this.state.msg}
                    </p>
                  </div>
                  <div className="flex w-full justify-start items-center mt-3">
                    <input
                      id="agree"
                      type="checkbox"
                      value={this.state.isAgreedCookie}
                      onChange={this.onChangeAgreed.bind(this)}
                      name="check"
                    />
                    <p className="text-small font-Poppins ml-2">
                      <label htmlFor="agree">
                        I agree to the use of cookies.
                      </label>
                    </p>
                  </div>
                </div>
                <div
                  className={
                    "flex w-full justify-center mb-2 " +
                    (this.state.msg ? "mt-16" : "mt-8")
                  }
                >
                  <button
                    className="w-5/6 h-10 bg-white border-2 border-blue-400 hover:bg-blue-400 text-blue-400 hover:text-white font-PoppinsMedium md:w-8/12 focus:outline-none"
                    type="submit"
                    name="createAcc"
                  >
                    Create account
                  </button>
                </div>
              </form>
            </div>
          </div>
        </FromCard>
      </div>
    );
  }

  render() {
    return (
      <div>
        <div
          className={
            " absolute w-screens h-screens justify-center items-center " +
            (this.state.isLoading ? "flex" : "hidden")
          }
        >
          <div className="flex flex-col w-screen h-screen bg-black bg-opacity-20 transition-opacity justify-center items-center">
            <div className="flex">
              <img
                src={cat}
                alt="cat"
                className="flex justify-center items-center m-auto"
              />
            </div>
            {/* <div>
              <p className="flex w-full h-full justify-center items-center font-PoppinsBold text-red-600 text-header">Loading</p>
            </div> */}
          </div>
        </div>
        <div className="flex flex-col items-center w-screen h-mobile md:h-screen">
          <div className="flex w-full h-1/6 justify-center items-center min-h-header">
            {this.renderHeader()}
          </div>
          <div className="flex w-full h-4/6 items-center justify-center min-w-full min-h-mobile md:min-h-desktop md:bg-gray-50">
            {this.state.isCreateAccountPass ? (
              <ActivationScreen
                email={this.state.email}
                username={this.state.username}
              />
            ) : (
              this.renderFrom()
            )}
          </div>
          <div className="flex w-full h-1/6 justify-center items-center min-h-footer">
            <p className="text-medium font-Poppins">
              Copyright © 2021 ยังไม่คิด.COM. All Rights Reserved.
            </p>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { message } = state.message;
  return {
    message,
  };
}

export default connect(mapStateToProps)(SignupScreen);
