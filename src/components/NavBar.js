import React from "react";
import {connect} from "react-redux";
import {Link, Redirect} from "react-router-dom";
import {logout} from "../actions/auth/auth";
import Alert from "../services/Alert";
import AuthService from "../services/AuthService";
import logo from "../assets/images/suesi_logo.png"

class NavBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            username: undefined,
            accountCode:undefined,
            roles: undefined,
            currentPage: props.currentPage,
            navbarOpen: false,
            showSeller: false,
            redirect: false,
            show_user_menu: false,
            show_user_menu_mobile: false,
            step:null
        };
    }

    async componentDidMount() {
        await this.getUser();
    }

    getUser() {
        let {user} = this.props;
        user = AuthService.deCodeJwt(user);
        if (user) {
            this.setState({
                username: user.user,
                accountCode: user.accountCode,
                roles: user.roles[0],
                showSeller: user.roles.includes("SELLER"),
                redirect: false,
                step:user.requestStep
            });
        }
    }

    // async getCart(){
    //     const cart = JSON.parse(localStorage.getItem('cart'))
    //     if(cart?.total <= 0 || cart === null){
    //         const {dispatch} = this.props
    //         await dispatch(getCart(this.state.accountCode))
    //     }
    // }

    logOut() {
        Alert.confirmLogout().then(() => {
            this.props.dispatch(logout());
            this.setState({
                username: undefined,
                role: undefined,
                currentPage: this.props.currentPage,
                navbarOpen: false,
                showSeller: false,
                redirect: true,
            });
        });
    }

    // renderUserMenu() {
    //     return (
    //         <div className="absolute top-2" onMouseLeave={() => this.setState({show_user_menu: false})}>
    //             <div className="relative flex flex-row w-10 h-14 cursor-pointer">
    //                 <img src={arrow_icon} width="24" height="24" alt="arrow" className="absolute top-9 left-1"/>
    //             </div>
    //             <div className="flex w-32 h-auto bg-white shadow-md rounded-md">
    //                 <div className="p-2 w-full flex flex-col space-y-3 mt-3">
    //                     <Link to="/profile" className="p-1 hover:bg-gray-900 rounded-md text-black hover:text-white w-full cursor-pointer">
    //                         <p className="text-slight font-PoppinsMedium uppercase">
    //                             profile
    //                         </p>
    //                     </Link>
    //                     <Link to="/addproduct" className="p-1 hover:bg-gray-900 rounded-md text-black hover:text-white cursor-pointer w-full">
    //                         <p className="text-slight font-PoppinsMedium uppercase">
    //                             addproduct
    //                         </p>
    //                     </Link>
    //                     <Link to="/editprofile" className="p-1 hover:bg-gray-900 rounded-md text-black hover:text-white cursor-pointer w-full">
    //                         <p className="text-slight font-PoppinsMedium uppercase">
    //                             Edit profile
    //                         </p>
    //                     </Link>
    //                 </div>
    //             </div>
    //         </div>
    //     );
    // }

    renderNavbar() {
        const {username} = this.state;
        const {cart} = this.props;
        return (
            <nav className="absolute w-screen flex flex-wrap items-center justify-between bg-gray-900 z-50">
                <div
                    className="container w-full lg:w-8/12 px-5 lg:px-0 mx-auto flex flex-col  lg:flex-row items-center">
                    <div
                        className="w-full relative flex justify-start items-center lg:w-2/6 lg:static lg:block lg:justify-start">
                        <div className="flex items-start w-full">
                            <Link
                                to="/home"
                                className="text-header font-PoppinsBold leading-relaxed inline-block mr-4 py-2 whitespace-nowrap uppercase text-white cursor-pointer"
                            >
                                <img src={logo} alt="logo" className="w-auto h-14" />
                            </Link>
                        </div>
                        <button
                            className="text-white cursor-pointer text-xl leading-none px-3 py-1 border border-solid border-transparent rounded bg-transparent block lg:hidden outline-none focus:outline-none"
                            type="button"
                            onClick={() =>
                                this.setState({navbarOpen: !this.state.navbarOpen})
                            }
                        >
                            <span className="material-icons">menu</span>
                        </button>
                    </div>
                    <div className={"w-2/6 justify-center items-center hidden lg:flex"}>
                        <div className="flex w-full px-2 h-14 items-center justify-center font-PoppinsMedium">
                            <input
                                className="pl-2 w-full h-4/6 focus:outline-none text-gray-800 rounded-sm"
                                placeholder="Search"
                            />
                        </div>
                    </div>
                    <div className={"lg:flex w-full lg:w-2/6 items-center text-white" + (this.state.navbarOpen ? " flex" : " hidden")}>
                        <ul className="flex flex-col w-full lg:w-full lg:flex-row justify-end list-none lg:ml-auto">
                            <li>{ username ? (
                                <div className="flex flex-col">
                                    <Link to="/profile" className="hidden md:flex">
                                        <span
                                            className="relative z-10 flex px-3 py-2 items-center text-medium uppercase font-PoppinsMedium w-full cursor-pointer rounded-md hover:bg-white hover:opacity-50 hover:text-black"
                                            // onMouseOver={() => this.setState({show_user_menu: !this.state.show_user_menu,})}
                                            onMouseDown={() => this.setState({show_user_menu_mobile: true})}
                                        >
                                            {username}
                                        </span>
                                    </Link>
                                    <span className="flex md:hidden ">
                                      <span
                                            className="relative z-10 flex px-3 py-2 items-center text-medium uppercase font-PoppinsMedium w-full cursor-pointer rounded-md hover:bg-white hover:opacity-50 hover:text-black"
                                            // onMouseOver={() => this.setState({show_user_menu: !this.state.show_user_menu})}
                                            onMouseDown={() => this.setState({show_user_menu_mobile: !this.state.show_user_menu_mobile})}
                                      >
                                      {username}
                                        </span>
                                    </span>
                                    <Link to="/profile" onMouseOver={() => this.setState({show_user_menu: !this.state.show_user_menu})}>
                                        <span className={"px-6 py-2 items-center text-slight uppercase font-PoppinsMedium w-full cursor-pointer rounded-md hover:bg-white hover:opacity-50 hover:text-black lg:hidden" + (this.state.show_user_menu_mobile ? " flex" : " hidden")}>
                                            Profile
                                        </span>
                                    </Link>
                                    <Link to="/editprofile">
                                          <span className={"px-6 py-2 items-center text-slight uppercase font-PoppinsMedium w-full cursor-pointer rounded-md hover:bg-white hover:opacity-50 hover:text-black lg:hidden" + (this.state.show_user_menu_mobile ? " flex" : " hidden")}>
                                              Edit profile
                                          </span>
                                    </Link>
                                    <Link to="/addproduct">
                                        <span className={"px-6 py-2 items-center text-slight uppercase font-PoppinsMedium w-full cursor-pointer rounded-md hover:bg-white hover:opacity-50 hover:text-black lg:hidden" + (this.state.show_user_menu_mobile ? (this.state.roles === "SELLER" ? " flex" : " hidden" ): " hidden")}>
                                            Addproduct
                                        </span>
                                    </Link>
                                    <Link to="/profile/upgradeToSeller" className={(this.state.roles === "BUYER" || this.state.step !== 4) ? "" : "hidden"}>
                                      <div className={"px-6 py-2 items-center text-slight uppercase font-PoppinsMedium w-full cursor-pointer rounded-md hover:bg-white hover:opacity-50 hover:text-black lg:hidden" + (this.state.show_user_menu_mobile ? " flex" : " hidden")}>
                                        <p>
                                          Upgrade to seller
                                        </p>
                                      </div>
                                    </Link>
                                </div>
                                ) : (
                                    <Link
                                        className="px-3 py-2 flex items-center text-medium uppercase font-PoppinsMedium rounded-md hover:bg-white hover:opacity-50 hover:text-black"
                                        to="/signin"
                                    >
                                        Sign in
                                    </Link>
                                )}
                                {/*<div className="hidden lg:flex">*/}
                                {/*    {show_user_menu ? this.renderUserMenu() : null}*/}
                                {/*</div>*/}
                            </li>
                            <li>
                                {username ? (
                                    <span
                                        className="relative z-10 px-3 py-2 flex lg:items-center text-medium uppercase font-PoppinsMedium cursor-pointer rounded-md hover:bg-white hover:opacity-50 hover:text-black"
                                        onClick={this.logOut.bind(this)}
                                        onMouseOver={() => this.setState({show_user_menu: false})}
                                    >
                                        logout
                                    </span>
                                ) : (
                                    <Link
                                        className="px-3 py-2 flex items-center text-medium uppercase font-PoppinsMedium rounded-md hover:bg-white hover:opacity-50 hover:text-black"
                                        to="/signup"
                                    >
                                        Sign UP
                                    </Link>
                                )}
                            </li>
                            <li>
                                <Link className={"hidden lg:flex px-3 py-2 flex items-center text-medium uppercase font-PoppinsMedium rounded-md hover:bg-white hover:opacity-50 hover:text-black"} to="">
                                    <span className="material-icons cursor-pointer hidden lg:flex">
                                        shopping_cart
                                    </span>
                                    <p className="flex lg:hidden">CART</p>
                                    <span className={"flex bg-red-500 w-5 h-5 rounded-full items-center justify-center" + (cart?.total > 0 ? "" : " hidden")}>
                                      <p className="flex justify-center items-center font-PoppinsMedium text-small">{cart?.total}</p>
                                    </span>
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        );
    }

    render() {
        const {currentPage, redirect} = this.state;
        if (currentPage !== "signin" || currentPage !== "signup") {
            if (redirect) {
                return <Redirect to="/signin"/>;
            } else {
                return this.renderNavbar();
            }
        }
    }
}

function mapStateToProps(state) {
    const {user} = state.auth;
    const {cart} = state.cart;
    return {
        user,
        cart
    };
}

export default connect(mapStateToProps)(NavBar);
