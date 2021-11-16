import React from 'react';
import NavBar from "../../components/NavBar";
import {connect} from "react-redux";
import {Redirect} from "react-router-dom";

class ProductDetailScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      isRedirect: false,
      prodShow: [],
      count: 0,
      maxProd: undefined
    }
  }

  async componentDidMount() {
    this.getData()
  }

  componentWillUnmount() {
    this.setState = (state, callback) => {
      return;
    };
  }

  getData(){
    const {prodPreview} = this.props
    if(prodPreview){
      this.setState({prodShow : prodPreview, maxProd: prodPreview.length})
    }
  }

  render() {
    const {isLoading, isRedirect, prodShow, maxProd} = this.state
    let { count } = this.state
    let prod = prodShow[count]
    return (
      isLoading ?
        <div>
          <NavBar currentPage="productdetail"/>
          Loading...
        </div>
        :
        isRedirect ? <Redirect to="/signin"/>
          :
          <div>
            <NavBar currentPage="productdetail"/>
            <div className="flex w-screen h-screen justify-center">
              <div
                className="flex flex-col w-full h-full items-center space-y-5 md:bg-gray-50 bg-none lg:w-8/12">
                <div className="md:flex w-full h-full mt-14">
                  <div className="flex md:w-1/2 md:h-full w-full h-auto bg-pink-100">
                    <div className="flex w-full h-full items-center justify-center">
                      <img src={prod?.prodImageShow[0]} alt={"imgShow"}/>
                    </div>
                  </div>
                  <div className="flex md:w-1/2 md:h-full w-full h-auto">
                    <div className="flex flex-row w-full h-full justify-center items-center">
                      <div className="flex flex-col w-full h-fully justify-center p-10 space-y-3">
                          <div>
                            <p className="font-PoppinsBold text-header text-gray-800 mb-3">
                              {prod?.prodName}
                            </p>
                            <p className="font-PoppinsBold text-header text-gray-800">{prod?.prodPrice}</p>
                          </div>
                        <div className="flex flex-row items-center space-x-3">
                          <p className="font-PoppinsBold text-sub-header text-gray-800">Color:</p>
                          <div className="font-PoppinsMedium text-sub-header cursor-pointer">
                            <span className={`flex w-8 h-8 bg-Prod-${prod?.prodColor.toLowerCase()} shadow-inner rounded-full`}/>
                          </div>
                        </div>
                        <div className="flex w-full items-center ">
                          <p className="font-PoppinsBold text-sub-header text-gray-800">Warranty:</p>
                          <p className="font-PoppinsBold text-sub-header text-gray-800 pl-2">{prod?.prodWarranty}Y</p>
                        </div>
                        <div className="flex w-full h-auto flex-col space-y-1">
                          <p className="font-PoppinsBold text-sub-header text-gray-800">Description </p>
                          <div
                            className="flex w-5/6 h-auto justify-center items-center bg-gray-700 ">
                            <hr></hr>
                          </div>
                          <p className="font-PoppinsMedium text-medium text-gray-800 flex align-middle">{prod?.prodDescription}</p>
                          <div
                            className="flex w-5/6 h-auto justify-center items-center bg-gray-700">
                            <hr></hr>
                          </div>
                          <div className="flex space-x-3">
                            <span className="flex w-44 h-8 rounded-md font-PoppinsMedium text-white bg-green-500 justify-center items-center cursor-pointer"
                                  onClick={()=> this.setState({count: (++count > maxProd-1) ? 0 : ++count})}>
                              Next Color
                            </span>
                            <span className="flex w-44 h-8 rounded-md font-PoppinsMedium text-white bg-yellow-500 justify-center items-center cursor-pointer"
                                  onClick={()=> this.props.history.push('addproduct')}
                            >
                              BackToAddProduct
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
    );
  }
}

function mapStateToProps(state) {
  const {prodPreview} = state.prodPreview
  return {
    prodPreview
  }
}

export default connect(mapStateToProps)(ProductDetailScreen);
