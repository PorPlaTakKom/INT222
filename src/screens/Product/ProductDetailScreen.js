import React from "react";
import NavBar from "../../components/NavBar";
import ProdService from "../../services/ProdService";
import ImgProd from "../../components/ImgProd";
import {connect} from "react-redux";
import AuthService from "../../services/AuthService";
import {Redirect} from "react-router-dom";
import Alert from "../../services/Alert";
import {pushProd} from "../../actions/user/cart";
import CheckOut from "../../components/CheckOut";

class ProductDetailScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      prodCode: undefined,
      isLoading: false,
      prod: [],
      prodDetail: [],
      prodColor: undefined,
      demo: undefined,
      des: {},
      isRedirect: false,
      shopName: "",
      shopType: "",
      isBuy: false,
      accountCode: undefined,
      prodBuy: undefined,
    };
  }

  async componentDidMount() {
    await this.getSearchParams();
    await this.getProd();
  }

  componentWillUnmount() {
    this.setState = (state, callback) => {
      return;
    };
  }

  getSearchParams() {
    const urlSearchParams = new URLSearchParams(window.location.search);
    const params = Object.fromEntries(urlSearchParams.entries());
    if (params.prodCode) {
      this.setState({prodCode: params.prodCode});
    }
  }

  getProd() {
    this.setState({isLoading: true});
    ProdService.getProdByProdCode(this.state.prodCode).then(
      (res) => {
        this.setState({
          shopName: res.data.shop.shopName,
          shopType: res.data.shop.type,
          prod: res.data,
          prodDetail: res.data.productDetailList,
          prodColor: res.data.productDetailList[0].colorName,
          isLoading: false,
        });
        this.setState({demo: res.data.description});
      },
      () => {
        this.props.history.push("/error");
      }
    );
  }

  async addProdToCart() {
    const {dispatch, user} = this.props;
    let data;
    const {prodDetail} = this.state
    const prodDetailColor = prodDetail.filter(f => f.colorName === this.state.prodColor)
    const prodDetailCodeList = prodDetailColor.map(m => m.productDetailCode)[0]
    const accountCode = AuthService.deCodeJwt(user)
    const prodQuantity = prodDetailColor[0].quantity
    // let oldCart =  JSON.parse(localStorage.getItem('cart'))
    let amount
    if (accountCode !== null) {
      await Alert.getInputQuantity().then(async res => {
        if (parseInt(res.value) <= prodQuantity) {
          amount = parseInt(res.value)
          data = {
            accountCode: accountCode.accountCode,
            cart: [{
              prodDetailCode: prodDetailCodeList,
              amount: amount
            }],
          }
          dispatch(pushProd(data)).then(async () => {
            await Alert.getGeneralAlertMsg('success', 'The product has been added to the cart.')
            const {cart} = this.props
            localStorage.setItem('cart', JSON.stringify(cart))
          }, (error) => {
            console.log(error.response)
          })
        } else if (parseInt(res.value) > prodQuantity) {
          await Alert.getGeneralAlertMsg('error', 'Too many products')
        }
      })
    } else {
      this.setState({isRedirect: true})
    }
  }

  async onBuyProd() {
    const {user} = this.props;
    const accountCode = AuthService.deCodeJwt(user).accountCode
    const {prodDetail, prod} = this.state
    const prodDetailColor = prodDetail.filter(f => f.colorName === this.state.prodColor)[0]
    const quantity = prodDetailColor.quantity
    let data = [];
    await Alert.getInputQuantity().then(async res => {
      if (parseInt(res.value) <= quantity) {
        data = [{
          code: prodDetailColor.productDetailCode,
          prodImage: prodDetailColor.imageList[0],
          prodColor: prodDetailColor.colorName,
          prodName: prod.prodName,
          amount: parseInt(res.value),
          price: prodDetailColor.price
        }]
        await this.setState({accountCode: accountCode, prodBuy: data})
        this.setState({isBuy: true})
      } else if (parseInt(res.value) > quantity) {
        await Alert.getGeneralAlertMsg('error', 'Too many products')
      } else {
        return;
      }
    })
  }

  render() {
    const {
      prod,
      prodDetail,
      isLoading,
      prodColor,
      demo,
      isRedirect,
      shopName,
      accountCode,
      prodBuy,
      isBuy,
    } = this.state;
    const prodDetails = prodDetail.filter((m) => m.colorName === this.state.prodColor)
    let quantity;
    let desc = demo?.split("\n");
    return isLoading ? (
      <div>
        <NavBar currentPage="productdetail"/>
        Loading...
      </div>
    ) : isRedirect ? (
      <Redirect to="/signin"/>
    ) : (
      <div className="">
        <NavBar currentPage="productdetail"/>
        <div className="flex w-screen h-screen justify-center">
          <div className="flex flex-col w-full h-full items-center space-y-5 md:bg-gray-50 bg-none lg:w-8/12 ">
            <div className="md:flex w-full h-full mt-14 ">
              {
                isBuy ? <div className="absolute flex w-screen h-screen bg-gray-800 bg-opacity-60 left-0 top-0 z-50">
                  <CheckOut buyNow={true} accCode={accountCode} prod={prodBuy}
                            isClose={(r) => this.setState({isBuy: r})}/>
                </div> : null
              }
              <div className="flex flex-col md:w-1/2 md:h-full w-full h-auto">
                <div className="flex w-full mt-20 pl-10">
                  <p className="flex w-auto font-PoppinsBold text-header text-gray-700 hover:text-blue-400 cursor-pointer"
                     onClick={() => this.props.history.push(`shop?name=${shopName.toLowerCase()}`)}>
                    {shopName}
                  </p>
                </div>
                <div className="flex w-full h-full">
                  <ImgProd prodDetail={prodDetail} color={prodColor}/>
                </div>
              </div>
              <div className="flex items-center justify-center md:w-1/2 md:h-full w-full h-full">
                <div className="flex flex-col w-full md:w-11/12 h-5/6 rounded-none md:rounded-md shadow-none md:shadow-md bg-white md:p-3">
                  <div className="flex flex-col justify-center w-full h-1/6">
                    <p className="font-PoppinsBold text-header text-gray-800 mb-3">
                      {prod.prodName}
                    </p>
                    {prodDetails.map((p, c) => (
                      <p key={c} className="flex items-center font-PoppinsBold w-full pl-3 h-2/4 text-sub-header text-gray-800 bg-gray-200 bg-opacity-60 md:rounded-md">
                        {p.price}.-
                      </p>
                    ))}
                  </div>
                  <div className="flex flex-col justify-center w-full h-1/6">
                    <div className="flex w-full h-full space-x-1 lg:space-x-3 h-10 items-center">
                      <div>
                        <p className="font-PoppinsBold text-medium lg:text-lg">Color :</p>
                      </div>
                      {prodDetail?.map((p, c) => (
                        <div className="flex w-auto p-1  items-center justify-center mt-0.5 border-2 border-gray-200 hover:border-blue-400  hover:text-blue-400 cursor-pointer rounded-md"
                             key={p.productDetailCode}
                             onClick={() => this.setState({prodColor: p.colorName})}
                        >
                          <p className="font-PoppinsMedium text-slight lg:text-medium ">{p.colorName}</p>
                        </div>
                      ))}
                    </div>
                    <div className="flex w-full h-full items-center">
                      <p className="font-PoppinsBold text-xl text-gray-800">
                        Warranty:
                      </p>
                      {prodDetails.map((p, m) => (
                        <p
                          key={m}
                          className="font-PoppinsBold text-xl text-gray-800 pl-2"
                        >
                          {p.warranty}Y
                        </p>
                      ))}
                    </div>
                  </div>
                  <div className="flex w-full h-10">
                    <div className="flex w-full h-full items-center">
                      <p className="font-PoppinsBold text-xl text-gray-800 pb-1">
                        Description
                      </p>
                    </div>
                  </div>
                  <div className="flex w-full h-auto bg-gray-700">
                    <hr></hr>
                  </div>
                  <div className="flex flex-col w-full md:h-3/6 p-3">
                      {desc?.map((e, k) => (
                        <p key={k} className="font-PoppinsMedium text-slight lg:text-medium text-gray-800 flex">
                          {e}
                        </p>
                      ))}
                  </div>
                  <div className="flex w-full h-auto bg-gray-700">
                    <hr></hr>
                  </div>
                  <div className="flex flex-col w-full h-1/6 p-3">
                    <div className="flex w-full h-auto justify-center">
                      <p className="font-PoppinsBold text-primary text-gray-800">
                        Quantity:
                      </p>
                      {prodDetails.map((p, m) => (
                        <p
                          key={m}
                          className="font-PoppinsBold text-primary text-gray-800 pl-2"
                        >
                          <span className="hidden">{quantity = p.quantity}</span>
                          {p.quantity}
                        </p>
                      ))}
                    </div>
                    <div className="flex w-full justify-center items-center mt-5">
                      {
                        quantity < 1  ? <p className="font-PoppinsMedium text-sub-header">Out Of Stock</p> :
                          <div className="flex w-full h-full">
                            <div className="flex w-1/2 justify-center items-center">
                              <span className="flex font-PoppinsMedium  items-center justify-center text-white w-28 h-8 bg-green-400 cursor-pointer rounded-md"
                                    onClick={this.onBuyProd.bind(this)}>
                                BUY
                              </span>
                          </div>
                            <div className="flex w-1/2 justify-center items-center">
                              <span
                                className="flex font-PoppinsMedium  items-center justify-center text-white w-28 h-8 bg-yellow-400 cursor-pointer rounded-md"
                                onClick={this.addProdToCart.bind(this)}>
                                Add to Cart
                              </span>
                            </div>
                          </div>
                      }
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
  const {cart} = state.cart;
  const {user} = state.auth;
  return {
    cart,
    user,
  };
}

export default connect(mapStateToProps)(ProductDetailScreen);
