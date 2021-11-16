import React from 'react';
import UserService from "../services/UserService";
import Alert from "../services/Alert";

class CheckOut extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      prodCheck: props.prod ? props.prod : null,
      accCode: props.accCode ? props.accCode : null,
      isBuyNow: props.buyNow ? props.buyNow : false
    }
  }

  componentWillUnmount() {
    console.log("Remove Data")
    this.setState({
      prodCheck: null,
      accCode: null,
      isBuyNow: false
    })
  }

  onPay() {
    const data = this.state.prodCheck
    const prodDetailCode = data.map(i => i.code)
    const prodAmount = data.map(i => i.amount)
    const {accCode} = this.state
    let prodList;
    let key;

    if(this.state.isBuyNow){
      key = 'itemForm'
      prodList = {
        prodDetailCode : prodDetailCode[0],
        amount : prodAmount[0]
      }
    }else{
      key = 'checkoutList'
      prodList = prodDetailCode
    }
    UserService.pay(accCode, prodList, key).then(async () => {
      await localStorage.removeItem('cart')
      await Alert.getGeneralAlertMsg('success', 'Successful Payment')
      window.location.reload();
    }, (e) => {
      Alert.getGeneralAlertMsg('error', e.response.data.errorMsg)
      console.log(e.response)
    })
  }

  render() {
    const {prodCheck} = this.state
    let totalPrice = 0
    return (
      <div className="flex w-full h-full justify-center items-center mx-auto ">
        <div className="relative w-8/12 h-4/6 rounded-md bg-white">
              <span className="absolute top-3 right-3 material-icons cursor-pointer"
                    onClick={() => this.props.isClose(false)}
              >
                close
              </span>
          <div className="flex flex-col w-full h-full">
            <p className="ml-3 mt-10 font-PoppinsMedium">Products</p>
            <span className="flex w-full md:w-10/12 flex-row font-PoppinsMedium text-small md:text-medium">
              <span className="flex w-full md:w-2/6 items-center justify-center">
              </span>
              <span className="flex w-full items-center justify-center">
                <p>ProductName</p>
              </span>
              <span className="flex w-full items-center justify-center">
                <p>Amount</p>
              </span>
               <span className="flex w-full items-center justify-center">
                <p>Price</p>
              </span>
            </span>
            <div className="flex flex-col w-full h-5/6 max-h-checkout overflow-y-auto">
              {
                prodCheck?.map((i, c) =>
                  <div key={c} className="flex">
                    <div className="flex w-full items-center justify-start space-x-3 p-5">
                          <span className="flex w-4/12 md:w-1/12 flex-row">
                            <img src={"https://www.tarkom-projects.com/api/v1/image/" + i.prodImage}
                                 alt={"prod"}
                                 className="w-full md:w-40"
                            />
                          </span>
                      <span className="flex w-9/12 flex-row">
                            <span className="flex w-1/3 items-center justify-center">
                              <p>{`${i.prodName} (${i.prodColor})`}</p>
                            </span>
                            <span className="flex w-1/3 items-center justify-center">
                              <p>{i.amount}</p>
                            </span>
                             <span className="flex w-1/3 items-center justify-center">
                               <span className="hidden">{totalPrice += i.price * i.amount}</span>
                              <p>{i.price * i.amount}</p>
                            </span>
                            </span>
                    </div>
                  </div>
                )
              }
            </div>
            <span>
              <p className="ml-3 mt-10 font-PoppinsMedium">Total Price: {totalPrice}</p>
            </span>
          </div>
          <div className="absolute flex bottom-5 w-auto h-10 right-10">
                  <span
                    className="w-24 h-8 rounded-md flex justify-center items-center bg-green-500 font-PoppinsMedium text-white hover:bg-green-600 cursor-pointer"
                    onClick={this.onPay.bind(this)}
                  >
                    Confirm
                  </span>
          </div>
        </div>
      </div>
    );
  }
}

export default CheckOut;