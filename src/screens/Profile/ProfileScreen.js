import React from "react";
import { Switch, Route, Link, Redirect } from "react-router-dom";
import cat from "../../assets/images/nyan-cat.gif";
import NavBar from "../../components/NavBar";
import AuthService from "../../services/AuthService";
import { connect } from "react-redux";
import ImpageProfile from "../../components/ImgProfile";
import { getProdSeller } from "../../actions/product/prod";
import UpgradeToSellerScreen from "./UpgradeToSellerScreen";
import UserService from "../../services/UserService";
import ProfileDetailScreen from "./ProfileDetailScreen";

class ProfileScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      username: null,
      accountCode: null,
      roles: undefined,
      email: null,
      wallet: 0,
      isLoading: true,
      isEditProd: false,
      step: undefined,
      prodCode: undefined,
    };
  }

  async componentDidMount() {
    await this.getUser();
    await this.getProdSeller();
    await this.getApproveStep();
  }

  componentWillUnmount() {
    this.setState = (state, callback) => {
      return;
    };
  }

  // componentDidUpdate(prevProps, prevState, snapshot) {
  //   if(this.state.isProdUpdate === true){
  //     this.getUser();
  //     this.setState({isProdUpdate:false})
  //   }
  // }

  getApproveStep() {
      UserService.getApproveStatus(this.state.accountCode).then(async (res) => {
        await this.setState({ step: res.data?.step });
      }, () =>{
        return;
      });
  }

  getUser() {
    let { user } = this.props;
    user = AuthService.deCodeJwt(user);
    if (user) {
      this.setState({
        username: user.user,
        accountCode: user.accountCode,
        roles: user.roles[0],
        email: user.email,
        wallet: user.wallet,
        step: user.requestStep,
        isLoading: false,
      });
    } else {
      this.setState({ isLoading: false });
    }
  }

  getProdSeller() {
    if (this.state.roles === "SELLER") {
      const { dispatch } = this.props;
      dispatch(getProdSeller(this.state.accountCode));
    }
  }

  renderProfile() {
    // const { cart } = this.props;
    const { step, roles } = this.state;
    return (
      <div className={"flex w-screen h-screen justify-center"}>
        {/*<div className={"absolute w-full h-full z-40" + (isEditProd ? " " : " hidden")}>*/}
        {/*  <UpdateProductsScreen/>*/}
        {/*</div>*/}
        <div className="flex flex-col md:flex-row mt-14 w-full justify-center items-center md:bg-gray-50 bg-white p-3 space-x-3 lg:w-8/12 md:min-h-desktop">
          <div className="flex w-full md:w-1/3 h-3/6 md:h-5/6 items-center justify-center mx-auto">
            <div className="flex flex-col items-center  md:items-start w-full md:w-4/5 h-full bg-white rounded-md md:shadow-md space-y-3  ">
              <div className="flex w-full items-center justify-center">
                <ImpageProfile />
              </div>
              <div className="hidden md:flex flex-row items-center md:items-start pl-5 md:flex-col space-y-0 md:space-y-3 space-x-10 md:space-x-0">
                <Link to="/profile">
                  <div>
                    <p className="font-PoppinsMedium cursor-pointer">Profile</p>
                  </div>
                </Link>
                <Link to="/editprofile">
                  <div>
                    <p className="font-PoppinsMedium cursor-pointer">
                      Edit Profile
                    </p>
                  </div>
                </Link>
                <Link
                  to="/addproduct"
                  className={this.state.roles === "SELLER" ? "" : "hidden"}
                >
                  <div>
                    <p className="font-PoppinsMedium cursor-pointer">
                      Add Product
                    </p>
                  </div>
                </Link>
                <Link to="/profile/upgradeToSeller"
                      className={(roles === "BUYER" || step !== 4) ? "" : "hidden"}>
                  <div>
                    <p className="font-PoppinsMedium cursor-pointer">
                      Upgrade to seller
                    </p>
                  </div>
                </Link>
              </div>
            </div>
          </div>
          <div className="flex w-full md:w-2/3 h-full md:h-5/6  items-center justify-center mx-auto pr-10  ">
            <Switch>
              <Route exact path={"/profile"} component={ProfileDetailScreen}>
                {/* <Redirect to="/editprofile/personalInfo" /> */}
              </Route>
              <Route
                path={"/profile/upgradeToSeller"}
                component={UpgradeToSellerScreen}
              ></Route>
            </Switch>
          </div>
        </div>
      </div>
    );
  }

  render() {
    const { username, isLoading, isEditProd,prodCode } = this.state;
    if (isEditProd) {
      return <Redirect push to={'/editproduct?prodCode=' + prodCode}/>;
    } else {
      return isLoading ? (
        <div
          className={
            " absolute w-screens h-screens justify-center items-center " +
            (isLoading ? "flex" : "hidden")
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
      ) : username ? (
        <div>
          <NavBar currentPage="profile" />
          {this.renderProfile()}
        </div>
      ) : (
        <Redirect to="home" />
      );
    }
  }
}

function mapStateToProps(state) {
  const { user } = state.auth;
  const { cart } = state.cart;
  const { prod_seller } = state.prod_seller;
  return {
    user,
    cart,
    prod_seller,
  };
}

export default connect(mapStateToProps)(ProfileScreen);
