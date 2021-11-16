import React from "react";
import AuthService from "../../services/AuthService";
import {connect} from "react-redux";
import { getCart, updataProd } from "../../actions/user/cart";
import Alert from "../../services/Alert";
import {Redirect} from "react-router-dom";
import UserService from "../../services/UserService";
import CheckOut from "../../components/CheckOut";

class ProfileDetailScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: null,
      accountCode: null,
      address: null,
      roles: undefined,
      email: null,
      wallet: 0,
      isLoading: true,
      isEditProd: false,
      prodCode: undefined,
      checkOutList: [],
      totalPrice: 0,
      isCheckOut: false,
      isSelectAll: false,
      countSelect: 0,
    };
  }

  async componentDidMount() {
    await this.getUser();
    this.getItemTolist();
  }

  componentWillUnmount() {
    this.setState = (state, callback) => {
      return;
    };
  }

  async getItemTolist() {
    const cart = JSON.parse(localStorage.getItem('cart'))
    if (cart?.total <= 0 || cart === null) {
      const {dispatch} = this.props
      await dispatch(getCart(this.state.accountCode)).then(() => {
        const {cart} = this.props;
        const cartItem = cart?.shoppingCartItemSumDTOList
        if (cartItem) {
          cartItem.forEach(i => {
            this.setState({
              checkOutList: [...this.state.checkOutList,
                {
                  code: i.productDetailCode,
                  isSelect: false,
                  price: i.price,
                  amount: i.amount,
                  prodName: i.prodName,
                  prodImage: i.imageList[0],
                  prodColor: i.colorName
                }
              ]
            })
          })
        } else {
          this.setState({isLoading: false})
        }
      })
    } else {
      const {cart} = this.props;
      const cartItem = cart?.shoppingCartItemSumDTOList
      if (cartItem) {
        cartItem.forEach(i => {
          this.setState({
            checkOutList: [...this.state.checkOutList,
              {
                code: i.productDetailCode,
                isSelect: false,
                price: i.price,
                amount: i.amount,
                prodName: i.prodName,
                prodImage: i.imageList[0],
                prodColor: i.colorName
              }
            ]
          })
        })
      } else {
        this.props.history.push('/error')
      }
    }
    this.setState({isLoading: false})
  }

  async getUser() {
    let {user} = this.props;
    user = AuthService.deCodeJwt(user);
    if (user) {
      await this.setState({
        username: user.user,
        accountCode: user.accountCode,
        roles: user.roles[0],
        email: user.email,
      });
    }
    UserService.getUserDetail(this.state.accountCode).then(res => {
      this.setState({address: res.data.address})
    })
  }

  onEditProdSeller(prodCode) {
    // const { dispatch } = this.props;
    // dispatch(getProdEdit(prodCode));
    this.setState({prodCode: prodCode, isEditProd: true});

  }

  renderMyProduct() {
    const {prod_seller} = this.props;
    const seller = prod_seller?.productList;
    return (
      <div className="flex flex-col w-full h-full space-y-3">
        {seller?.map((c, k) =>
          <div className="flex flex-row font-PoppinsMedium" key={k}>
            <div className="flex items-center justify-center w-1/2 h-8 bg-red-500">
              ProductID:{c.prodCode} | {c.brandName} {c.prodName}
            </div>
            <div className="flex items-center justify-center w-1/2 h-8 bg-blue-500">
              <span key={k} className="cursor-pointer" onClick={() => this.onEditProdSeller(c.prodCode)}>Edit</span>
            </div>

          </div>
        )}
      </div>
    );
  }

  async onDeleteCart(cartDetal) {
    const { checkOutList } = this.state
    let checkOutListEdit = []
    const {cart} = this.props;
    const arr_prod = [cartDetal.productDetailCode];
    await checkOutList.forEach((i) => {
      const newData = {...i, amount: i.amount-=1}
      checkOutListEdit = [...checkOutListEdit, newData]
    })
    const data = {
      accountCode: cart.accountCode,
      cart: [{
        prodDetailCode: arr_prod[0],
        amount: 1
      }]
    };
    const {dispatch} = this.props;
    dispatch(updataProd(data)).then((res) => {
      const {cart} = this.props;
      Alert.getGeneralAlertMsg("success", "Deleted!");
      this.setState({checkOutList: checkOutListEdit})
      localStorage.setItem("cart", JSON.stringify(cart));
    });
  }

  addToCheckOutList(e) {
    const list = this.state.checkOutList
    const code = e.target.value.split(',')[0]
    const index = e.target.value.split(',')[1]
    let data_filter = list.filter(i => i.code === parseInt(code))
    let data = list
    let dataEdit
    if (data_filter.length > 0) {
      dataEdit = {
        code: data_filter[0].code,
        isSelect: !data_filter[0].isSelect,
        amount: data_filter[0].amount,
        price: data_filter[0].price,
        prodName: data_filter[0].prodName,
        prodImage: data_filter[0].prodImage,
        prodColor: data_filter[0].prodColor
      }
    } else {
      return
    }
    data[index] = dataEdit
    if (data[index].isSelect === true) {
      // eslint-disable-next-line
      this.setState({countSelect: ++this.state.countSelect, totalPrice: this.state.totalPrice += (dataEdit.price * dataEdit.amount)
      })
      // eslint-disable-next-line
      if (this.state.countSelect++ === this.state.checkOutList.length) {this.setState({isSelectAll: true})}
    } else {
      // eslint-disable-next-line
      this.setState({countSelect: --this.state.countSelect, totalPrice: this.state.totalPrice -= (dataEdit.price * dataEdit.amount)})
      // eslint-disable-next-line
      if (this.state.countSelect-- <= this.state.checkOutList.length) {this.setState({isSelectAll: false})}
    }
    this.setState({checkOutList: data})
  }

  checkOut() {
    if (this.state.countSelect > 0) {
      this.setState({isCheckOut: true})
    } else {
      Alert.getGeneralAlertMsg("warning", "You did not select the product")
    }
  }

  async checkOutAll() {
    const data = this.state.checkOutList
    let newData = []
    let totalPrice = 0
    if (!this.state.isSelectAll) {
      data.forEach((i, c) => {
        totalPrice += i.price
        if (i.isSelect === false) {
          newData[c] = {
            code: i.code,
            isSelect: true,
            amount: i.amount,
            price: i.price,
            prodName: i.prodName,
            prodImage: i.prodImage,
            prodColor: i.prodColor
          }
        } else {
          newData[c] = {...i}
        }
      })
      this.setState({countSelect: this.state.checkOutList.length, totalPrice: totalPrice})
    } else {
      data.forEach((i, c) => {
        newData[c] = {
          code: i.code,
          isSelect: false,
          amount: i.amount,
          price: i.price,
          prodName: i.prodName,
          prodImage: i.prodImage,
          prodColor: i.prodColor
        }
      })
      this.setState({countSelect: 0, totalPrice: 0})
    }
    this.setState({checkOutList: newData, isSelectAll: !this.state.isSelectAll})
  }

  onPay() {
    const data = this.state.checkOutList.filter(f => f.isSelect === true)
    const prodList = data.map(i => i.code)
    const {accountCode} = this.state
    UserService.pay(accountCode, prodList).then(async () => {
      await localStorage.removeItem('cart')
      await Alert.getGeneralAlertMsg('success','Successful Payment')
      window.location.reload();
    }, (e) => {
      Alert.getGeneralAlertMsg('error',e.response.data.errorMsg)
      console.log(e.response)
    })
  }

renderCartDetail()
{
  const {cart} = this.props;
  const cartItem = cart?.shoppingCartItemSumDTOList
  const {isCheckOut, isLoading, checkOutList} = this.state
  const prodCheck = checkOutList.filter(f => f.isSelect === true)
  return (
    isLoading ? <div>Loading...</div> :
      <div className="flex flex-col items-center w-full h-full bg-white rounded-md md:shadow-md p-8">
        {isCheckOut ?
          <div
            className="absolute z-50 left-0 top-0 w-full h-full justify-center items-center bg-gray-800 bg-opacity-50">
            {
              <CheckOut accCode={this.state.accountCode} prod={prodCheck} isClose={(r) => this.setState({isCheckOut: r})}/>
            }
          </div> : null
        }
        <div
          className={"flex flex-col w-full h-2/4 item-center space-y-3" + (this.state.roles === "SELLER" ? "" : " hidden")}>
          <p className="font-PoppinsMedium text-primary">My Product</p>
          <hr/>
          {this.renderMyProduct()}
        </div>
        <div
          className={"relative flex flex-col w-full justify-start space-y-3" + (this.state.roles === "SELLER" ? " h-2/4" : " h-full")}>
          <p className="font-PoppinsMedium text-primary">My Cart</p>
          <hr/>
          <div className={"flex flex-row w-full h-full flex-col " + (cart?.total > 0 ? "" : " hidden")}>

            <div className="flex w-full text-slight md:text-medium">
              <span className="flex w-1/12 h-full"/>
              <span className="flex w-3/12 h-full justify-center items-center">
                    <p>Brand</p>
                  </span>
              <span className="flex w-6/12 h-full justify-center items-center">
                    <p>Name</p>
                  </span>
              <span className="flex w-2/12 h-full justify-center items-center">
                    <p>Price</p>
                  </span>
              <span className="flex w-2/12 h-full justify-center items-center">
                    <p>Amount</p>
                  </span>
              <span className="flex w-2/12 h-full"/>
            </div>
            <div className="flex flex-col w-full max-h-cartlist overflow-y-auto text-slight md:text-medium">
              {cartItem?.map((m, c) => (
                <div key={c} className="flex w-full h-full text-center font-Poppins text-slight md:text-medium p-3">
                    <span className="flex w-1/12 h-full items-center justify-center">
                      <input type="checkbox" name={"prod"} checked={this.state.checkOutList[c]?.isSelect} id={c}
                             value={[m.productDetailCode, c]}
                             onChange={this.addToCheckOutList.bind(this)}/>
                    </span>
                  <span className="flex w-3/12 h-full justify-center items-center">
                      <p>{m.brandName}</p>
                    </span>
                  <span className="flex w-6/12 h-full justify-center items-center">
                      <p>{`${m.prodName} (${m.colorName})`}</p>
                    </span>
                  <span className="flex w-2/12 h-full justify-center items-center">
                    <p>{m.price}</p>
                    </span>
                  <span className="flex w-2/12 h-full justify-center items-center">
                    <p>{m.amount}</p>
                    </span>
                  <span className="flex w-2/12 h-full justify-center items-center">
                      <p className="cursor-pointer font-PoppinsMedium text-red-500"
                         onClick={() => this.onDeleteCart(m)}>
                        Delete
                      </p>
                    </span>
                </div>
              ))}
            </div>
          </div>
          <div className={"md:absolute flex bottom-0 w-full h-10" + (cart?.total > 0 ? "" : " hidden")}>
            <div className="flxe w-3/12 h-full">
              <div className="flex h-full items-center justify-center">
                <label htmlFor="all" className="font-PoppinsMedium">Select All </label>
                <input className="ml-3" type="checkbox" id="all" checked={this.state.isSelectAll}
                       onChange={this.checkOutAll.bind(this)}/>
              </div>
            </div>
            <div className="flxe w-9/12 h-full">
              <div className="flex h-full items-center justify-end">
                <span
                  className="flex rounded-md w-24 h-8 bg-blue-400 hover:bg-blue-500 font-PoppinsMedium text-white items-center justify-center cursor-pointer"
                  onClick={this.checkOut.bind(this)}
                >
                  <p>CheckOut</p>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
}

render() {
  const {prodCode, isEditProd, isLoading} = this.state
  if (isEditProd) {
    return <Redirect push to={'/editproduct?prodCode=' + prodCode}/>;
  } else {
    return (
      isLoading ? <div
          className="flex flex-col items-center w-full h-full bg-white rounded-md md:shadow-md p-8 items-center justify-center">Loading...</div> :
        this.renderCartDetail()
    )
  }
}
}

function mapStateToProps(state) {
  const {user} = state.auth;
  const {cart} = state.cart
  const {prod_seller} = state.prod_seller;
  return {
    user,
    cart,
    prod_seller,
  };
}

export default connect(mapStateToProps)(ProfileDetailScreen);
