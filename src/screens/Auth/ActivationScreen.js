import React from "react";
import FormCard from "../../components/FormCard";
import Alert from "../../services/Alert";
import AuthService from "../../services/AuthService";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import { resencode } from "../../actions/auth/auth";

class ActivationScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: props.username,
      email: props.email,
      activateCode: "",
      msg: "",
      redirect: false,
    };
  }

  onChangeCode(e) {
    this.setState({ activateCode: e.target.value });
    if (this.state.msg) {
      this.setState({ msg: "" });
    }
  }

  handleActivateCode(e) {
    e.preventDefault();
    if (this.state.activateCode) {
      AuthService.confirmCode(this.state.activateCode)
        .then(
          async () => {
            await Alert.getGeneralAlertMsg("success", "Activate", "Success");
            this.setState({ redirect: true });
          }, error =>{
            Alert.getGeneralAlertMsg("error", "Wrong activation code")
          })
    } else {
      this.setState({ msg: "Please enter your activation code." });
    }
  }

  onResendCode() {
    const { dispatch } = this.props;
    dispatch(resencode(this.state.username)).then(
      (res) => {
        Alert.getGeneralAlertMsg(
          "success",
          "Resend code success",
          "Please check your email again"
        );
        const { message } = this.props;
      },
      (error) => {
        const { message } = this.props;
        Alert.getGeneralAlertMsg("error", "Resend code fail");
      }
    );
  }

  renderFormCard() {
    return (
      <FormCard width={"30%"} height={"80%"} border={"1px solid #BEBEBE"}>
        <div className="flex justify-center items-center w-screen h-full font-PoppinsMedium">
          <div className="flex flex-col w-full justify-center items-center">
            <div className="flex w-full h-1/6 justify-center items-center">
              <p className="text-header font-PoppinsBold text-center mb-8">
                Activate Your Account
              </p>
            </div>
            <form
              className="flex flex-col w-full h-full"
              onSubmit={this.handleActivateCode.bind(this)}
            >
              <div className=" flex flex-col w-full space-y-6 items-center">
                <div className="flex flex-col text-primary items-center ">
                  <p className="text-blue-600">
                    An activation code was sent to
                  </p>
                  <p className="text-green-500 ">{this.state.email}</p>
                </div>
                <div className="flex text-primary space-x-1">
                  <p className="text-blue-600">ref : </p>
                  <p className="text-green-500 text-primary">
                    {this.props.refCode}
                  </p>
                </div>

                <input
                  className="pl-2 border-gray-300 border-2 rounded-sm w-5/6 h-10 focus:outline-none md:w-7/12"
                  placeholder=""
                  type="text"
                  value={this.state.activateCode}
                  onChange={this.onChangeCode.bind(this)}
                />
              </div>

              <div className="flex flex-col w-5/6 h-5 mt-3 mx-auto md:w-7/12">
                <div className="flex w-full justify-start items-center">
                  <p className="text-small font-Poppins text-red-500">
                    {this.state.msg}
                  </p>
                </div>
              </div>
              <div className="flex w-full justify-center mt-10  ">
                <button
                  className="w-5/6 h-10 bg-blue-400 hover:bg-blue-700 text-white font-PoppinsMedium md:w-7/12 mb-4"
                  type="submit"
                >
                  Activate Now
                </button>
              </div>

              <div
                onClick={() => this.onResendCode()}
                className="flex m-auto items-center justify-center w-5/6 h-10  font-PoppinsMedium md:w-7/12  border-2 border-blue-400 hover:text-blue-700 text-blue-400 hover:border-blue-700 cursor-pointer"
              >
                <p className=" ">Resend Code</p>
              </div>
            </form>
          </div>
        </div>
      </FormCard>
    );
  }

  render() {
    const { redirect } = this.state;
    if (redirect) {
      return <Redirect to="signin" />;
    }
    return this.renderFormCard();
  }
}

function mapStateToProps(state) {
  const { refCode } = state.auth;
  const { message } = state.message;
  return {
    refCode,
    message,
  };
}

export default connect(mapStateToProps)(ActivationScreen);
