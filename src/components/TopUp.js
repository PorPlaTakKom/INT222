import React, {Component} from 'react';
import Cards from 'react-credit-cards';
import UserService from "../services/UserService";
import AuthService from "../services/AuthService";
import {connect} from "react-redux";
import Alert from "../services/Alert";
import {getCard} from "../actions/user/card";

class TopUp extends Component {

  constructor(props) {
    super(props);
    this.state = {
      card: props.cardData ? props.cardData :
        {
          cardNumber: '',
          cardHolderName: '',
          expireDate: '',
          cvc: '',
        },
      cardType: "",
      price: "",
      cvc: "",
      accCode: ""
    }
  }

  componentDidMount() {
    this.checkCard()
  }

  componentWillUnmount() {
    this.setState = (state, callback) => {
      state.card = {
        cardNumber: '',
        cardHolderName: '',
        expireDate: '',
        cvc: '',
      }
      return;
    };
  }

  checkCard() {
    let {user, card} = this.props;
    user = AuthService.deCodeJwt(user);
    UserService.CheckCard(user.accountCode).then(async res => {
      if (res.data.isCard) {
        if (card) {
          this.setState({
            card: {
              ...this.state.card,
              cardNumber: `************${card.last4Digit}`,
              cardHolderName: card.cardHolderName,
              expireDate: card.cardExpiredDate
            }, cardType: card.cardIssuer.toString(), accCode: user.accountCode
          })
        }else{
          const { dispatch,user } = this.props
          const users = AuthService.deCodeJwt(user);
          dispatch(getCard(users.accountCode)).then( () => {
            const { card } = this.props
            this.setState({
              card: {
                ...this.state.card,
                cardNumber: `************${card.last4Digit}`,
                cardHolderName: card.cardHolderName,
                expireDate: card.cardExpiredDate
              }, cardType: card.cardIssuer.toString(), accCode: users.accountCode
            })
          })
        }
      } else {
        await Alert.getGeneralAlertMsg('error', 'You don\'t have credit card', 'Please add a credit card first.')
        this.props.onChange({isClose: false})
      }
    })
  }

  onChang(e) {
    if (e.target.value) {
      this.setState({[e.target.name]: parseInt(e.target.value)})
    } else {
      this.setState({[e.target.name]: ""})
    }
  }

  onSubmit(e) {
    e.preventDefault()
    const data = {
      accountCode: this.state.accCode,
      cvc: this.state.cvc,
      amount: this.state.price
    }
    UserService.topUp(data).then( async res => {
      await Alert.getGeneralAlertMsg('success','Top up successfully')
      this.props.Money(res.data.wallet)
      this.props.onChange({isClose: false})
    }, (e) => {
      console.log(e.response)
      Alert.getGeneralAlertMsg('error',e.response.data.errorMsg)
    })
  }

  render() {
    const {card, cardType} = this.state
    return (
      <div className="relative flex w-11/12 md:w-6/12 h-5/6 md:h-4/6 min-h-mobile max-h-mobile bg-white rounded-md">
          <span className="absolute top-3 right-3 material-icons cursor-pointer"
                onClick={() => this.props.onChange({isClose: false})}>
                close
          </span>
        <div className="flex w-full h-full items-center justify-center p-8">
          <div className="flex flex-col w-full h-full">
            <p className="font-PoppinsMedium mb-5"> MyCard </p>
            <Cards id="PaymentForm"
                   cvc={''}
                   expiry={card.expireDate}
                   focused={this.state.focus}
                   name={card.cardHolderName}
                   number={card.cardNumber}
                   preview={true}
                   issuer={(cardType ? cardType : '')}
            />
            <form onSubmit={this.onSubmit.bind(this)}>
              <div className="flex flex-wrap w-full md:w-8/12 lg:w-4/12 mx-auto items-center justify-center mt-6">
                <label htmlFor="500"
                       className="flex w-16 h-8 border-2 border-blue-400 rounded-md items-center justify-center font-PoppinsMedium cursor-pointer m-3">
                  500
                </label>
                <input hidden={true} onChange={() => this.setState({price: 500})} value={this.state.price} id="500"
                       type="checkbox"/>

                <label htmlFor="1000"
                       className="flex w-16 h-8 border-2 border-blue-400 rounded-md items-center justify-center font-PoppinsMedium cursor-pointer m-3">
                  1000
                </label>
                <input hidden={true} onChange={() => this.setState({price: 1000})} value={this.state.price} id="1000"
                       type="checkbox"/>

                <label htmlFor="2000"
                       className="flex w-16 h-8 border-2 border-blue-400 rounded-md items-center justify-center font-PoppinsMedium cursor-pointer m-3">
                  2000
                </label>
                <input hidden={true} onChange={() => this.setState({price: 2000})} value={this.state.price} id="2000"
                       type="checkbox"/>

                <label htmlFor="5000"
                       className="flex w-16 h-8 border-2 border-blue-400 rounded-md items-center justify-center font-PoppinsMedium cursor-pointer m-3">
                  5000
                </label>
                <input hidden={true} onChange={() => this.setState({price: 5000})} value={this.state.price} id="5000"
                       type="checkbox"/>

                <label htmlFor="10000"
                       className="flex w-16 h-8 border-2 border-blue-400 rounded-md items-center justify-center font-PoppinsMedium cursor-pointer m-3">
                  10000
                </label>
                <input hidden={true} onChange={() => this.setState({price: 10000})} value={this.state.price} id="10000"
                       type="checkbox"/>

                <label htmlFor="50000"
                       className="flex w-16 h-8 border-2 border-blue-400 rounded-md items-center justify-center font-PoppinsMedium cursor-pointer m-3">
                  50000
                </label>
                <input hidden={true} onChange={() => this.setState({price: 50000})} value={this.state.price} id="50000"
                       type="checkbox"/>
                <span className="flex flex-row w-full items-center justify-center mt-5">
                    <span className="flex flex-col w-1/2 items-center justify-center">
                      <label htmlFor='price' className="font-PoppinsMedium text-slight">Custom Amount</label>
                      <input name='price' id='price' onChange={this.onChang.bind(this)} type="tel" maxLength={6} min={0}
                             max={999999} value={this.state.price}
                             className="w-24 h-8 border-2 border-blue-400 rounded-md p-1 font-PoppinsMedium focus:outline-none"/>
                    </span>
                    <span className="flex flex-col w-1/2 items-center justify-center text-slight">
                      <label htmlFor='cvc' className="font-PoppinsMedium">CVC</label>
                      <input name='cvc' id='cvc' onChange={this.onChang.bind(this)} type="password" maxLength={3}
                             min={0} max={3} value={this.state.cvc}
                             className="w-24 h-8 border-2 border-blue-400 rounded-md p-1 font-PoppinsMedium focus:outline-none"/>
                    </span>
                  </span>
              </div>
              <span className="flex items-center justify-center mt-5">
                    <button
                      className="w-24 h-8 rounded-md bg-green-400 hover:bg-green-500 text-white font-PoppinsMedium bg-yellow-500">Confirm</button>
                  </span>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const {user} = state.auth;
  const {card} = state.card
  return {
    user,
    card
  };
}


export default connect(mapStateToProps)(TopUp);