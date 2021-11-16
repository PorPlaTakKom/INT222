import React from "react";
import NavBar from "../components/NavBar";
import {Redirect, withRouter} from "react-router-dom";
import Pagination from "../components/Pagination";
import Carousels from "../components/Carousels";

class HomeScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      prod: [],
      isError: false,
    };
  }

  render() {
    const {isError} = this.state
      return (
          isError ? <Redirect to='/error'/> :
          <div>
            <NavBar currentPage="home"/>
            <div className="flex w-screen h-auto justify-center items-center">
              <div className="flex mt-14 flex-col w-11/12 h-full items-center space-y-5 md:bg-gray-50 bg-none lg:w-8/12">
                <div className="flex w-10/12 h-52 bg-yellow-100 mt-24 ">
                  <p className="flex justify-center items-center mx-auto font-PoppinsMedium text-header">space for advertising</p>
                </div>
                <div className="flex flex-col w-11/12  h-auto  md:w-10/12">
                  <div className="flex flex-col w-full h-prodCard mb-12">
                    <p>Apple Store</p>
                    <Carousels prodName={"Apple Store"} Official={true}/>
                  </div>
                  <div className="flex flex-col w-full h-prodCard mb-12">
                    <p>Samsung Official</p>
                    <Carousels prodName={"Samsung Official"} Official={true}/>
                  </div>
                  <div className="flex flex-col w-full h-prodCard mb-12">
                    <p>Nokia Official</p>
                    <Carousels prodName={"Nokia Official"} Official={true}/>
                  </div>
                  <div className="flex flex-col w-full h-prodCardAll">
                    <Pagination/>
                  </div>
                </div>
              </div>
            </div>
          </div>
      );
    }
}

export default withRouter(HomeScreen);
