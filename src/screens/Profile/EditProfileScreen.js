import React from "react";
import { connect } from "react-redux";
import NavBar from "../../components/NavBar";
import cat from "../../assets/images/nyan-cat.gif";
import { Switch, Route, Link, Redirect } from "react-router-dom";
import EditPersonalInfoScreen from "./EditPersonalInfoScreen";
import EditAddressScreen from "./EditAddressScreen";
import ImpageProfile from "../../components/ImgProfile";
import AuthService from "../../services/AuthService";
import UserService from "../../services/UserService";
import EditPaymentScreen from "./EditPaymentScreen";
import Alert from "../../services/Alert";

class EditProfileScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      isSeller: false,
      isRedirect: false,
      previewImage: null,
      param: "",
      editPage: "",
      isShow: false,
      currentProfileImg: null,
      isProfileLoading: false,
    };
  }

  componentDidMount() {
    this.getUser();
  }

  componentWillUnmount() {
    this.setState = (state, callback) => {
      return;
    };
  }

  async getUser() {
    let { user } = this.props;
    user = AuthService.deCodeJwt(user);
      if (user) {
        this.setState({
          username: user.user,
          roles: user.roles,
          email: user.email,
          isLoading: false,
        });
      } else {
      await Alert.getGeneralAlertMsg('error', 'Don\'t have permission \n to access this page')
      this.setState({isRedirect: true})
    }
  }

  getImage() {
    this.setState({ isProfileLoading: true });
    UserService.getImage(this.state.currentProfileImg).then((res) => {
      this.setState({
        currentProfileImg: new Buffer(res.data, "binary").toString("base64"),
        isProfileLoading: false,
      });
    });
  }

  renderForm() {
    return (
      <div className="flex w-screen h-screen justify-center ">
        <div className="flex mt-14 w-full justify-center items-center md:bg-gray-50 bg-none p-3 space-x-3 lg:w-8/12 md:min-h-desktop">
          <div className="flex w-full h-full">
            <div
              className={
                " w-full md:flex md:w-1/3 ml-0 md:ml-5 lg:ml-0" +
                (!this.state.isShow ? " flex" : " hidden")
              }
            >
              <div className="flex flex-row w-full h-full justify-center items-center ml-4 ">
                <div className="flex flex-col w-full md:w-11/12 h-full md:h-5/6 bg-white rounded-md md:shadow-md min-w-editProfile ml-3 ">
                  {/*<showimageprofile>*/}
                  <div
                    className={
                      "w-full h-auto md:flex" +
                      (!this.state.isShow ? " flex" : " hidden")
                    }
                  >
                    <ImpageProfile isChangeImg={true} />
                  </div>
                  {/*</showimageprofile>*/}
                  <div className="w-5/6 mx-auto hidden md:flex">
                    <hr />
                  </div>
                  {/*<showprofile>*/}
                  <div className="flex flex-col w-full h-auto p-5">
                    <div className="mb-3 ml-2 hidden md:flex">
                      <div className="flex w-2/3">
                        <p className="font-bold font-PoppinsMedium">
                          My Profile
                        </p>
                      </div>
                    </div>
                    <div className="ml-4 font-PoppinsMedium space-y-3 flex-col hidden md:flex">
                      <div className="hover:underline">
                        <Link
                          to="/editprofile/personalInfo"
                          className="cursor-pointer"
                        >
                          <p>Personal information</p>
                        </Link>
                      </div>
                      <div className="hover:underline">
                        <Link
                          to="/editprofile/address"
                          className="cursor-pointer"
                        >
                          <p>Address</p>
                        </Link>
                      </div>
                      <div className="hover:underline">
                        <Link to="/editprofile/payment" className="cursor-pointer">
                          <p>Payment method</p>
                        </Link>
                      </div>
                    </div>

                    {/*<mobilemenu>*/}
                    <div
                      className={
                        "font-PoppinsMedium w-11/12 h-auto mx-auto flex-col flex md:hidden mx-auto" +
                        (!this.state.isShow ? " flex" : " hidden")
                      }
                    >
                      <Link
                        to="/editprofile/personalInfo"
                        className="w-full h-20 flex flex-row items-center"
                        onClick={() => {
                          this.setState({ isShow: true });
                        }}
                      >
                        <div className="flex w-2/3">
                          <span className="cursor-pointer">
                            <p className="text-primary">Personal information</p>
                          </span>
                        </div>
                        <div className="flex w-1/3 justify-end">
                          <span className="material-icons text-header font-PoppinsMedium-">
                            chevron_right
                          </span>
                        </div>
                      </Link>
                      <hr />
                      <Link
                        to="/editprofile/address"
                        className="w-full h-20 flex flex-row items-center"
                        onClick={() => {
                          this.setState({ isShow: true });
                        }}
                      >
                        <div className="flex w-2/3 ">
                          <span className="cursor-pointer">
                            <p className="text-primary">Address</p>
                          </span>
                        </div>
                        <div className="flex w-1/3 justify-end">
                          <span className="material-icons text-header font-PoppinsMedium-">
                            chevron_right
                          </span>
                        </div>
                      </Link>
                      <hr />
                      <Link
                        to="/editprofile/payment"
                        className="w-full h-20 flex flex-row items-center"
                        onClick={() => {
                          this.setState({ isShow: true });
                        }}
                      >
                        <div className="flex w-2/3 ">
                          <span className="cursor-pointer">
                            <p className="text-primary">Payment method</p>
                          </span>
                        </div>
                        <div className="flex w-1/3 justify-end">
                          <span className="material-icons text-header font-PoppinsMedium-">
                            chevron_right
                          </span>
                        </div>
                      </Link>
                      <hr />
                    </div>
                    {/*</mobilemenu>*/}
                  </div>
                  {/*</showprofile>*/}
                  <div className="absolute flex w-full items-center left-96 bottom-28 cursor-pointer z-10"
                       onClick={()=> this.props.history.push("/profile")}>
                    <span className="material-icons">navigate_before</span>
                    <span className="font-PoppinsMedium">Back</span>
                  </div>
                </div>
              </div>
            </div>

            <div className={`w-full md:w-3/4 ${this.state.isShow ? "" : "md:flex hidden"}`}>
              <div className="flex h-full w-full justify-center items-center ml-1">
                <div className=" md:hidden block">
                  <div className="absolute top-24 ml-8">
                    <Link to="/editprofile" className="flex justify-center items-center" onClick={() => {this.setState({ isShow: false });}}>
                      <span className="material-icons">navigate_before</span>
                      <span className="relative flex font-PoppinsMedium text-primary text-black">Back</span>
                    </Link>
                  </div>
                </div>
                <div className="flex w-full md:w-11/12 h-5/6 bg-white rounded-md md:shadow-md ">
                  <Switch>
                    <Route
                      exact
                      path={"/editprofile"}
                      component={EditPersonalInfoScreen}
                    >
                      <Redirect to="/editprofile/personalInfo" />
                    </Route>
                    <Route
                      path={"/editprofile/personalInfo"}
                      component={EditPersonalInfoScreen}
                    />
                    <Route
                      path={"/editprofile/address"}
                      component={EditAddressScreen}
                    />
                    <Route
                      path={"/editprofile/payment"}
                      component={EditPaymentScreen}
                    />
                  </Switch>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  render() {
    const { isLoading, isRedirect } = this.state;
    if (isRedirect) {
      return <Redirect to="/"/>;
    } else {
      return (
        <div>
          <div
            className={
              "absolute w-screens h-screens justify-center items-center" +
              (isLoading ? " flex" : " hidden")
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
            </div>
          </div>
          <div className=" ">
            <NavBar currentPage="/editprofile" />
            {this.renderForm()}
          </div>
        </div>
      );
    }
  }
}

function mapStateToProps(state) {
  const { user } = state.auth;
  const { message } = state.message;
  const { img_name } = state.image;
  return {
    user,
    message,
    img_name,
  };
}
export default connect(mapStateToProps)(EditProfileScreen);
