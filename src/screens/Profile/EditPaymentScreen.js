import React from "react";
import AuthService from "../../services/AuthService";
import UserService from "../../services/UserService";
import {connect} from "react-redux";
import Cards from 'react-credit-cards';
import 'react-credit-cards/es/styles-compiled.css';
import Alert from "../../services/Alert";
import {getCard} from "../../actions/user/card";

class EditPaymentScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      accountCode: null,
      focus: '',
      card:{
        cardNumber: '',
        cardHolderName: '',
        expireDate: '',
        cvc: '',
      },
      isCard: undefined,
      cardType: ''
    };
  }

  async componentDidMount() {
    await this.getUser();
    await this.checkCard(this.state.accountCode)
  }

  componentWillUnmount() {
    this.setState = (state, callback) => {
      return;
    };
  }

  getUser() {
    let {user} = this.props;
    user = AuthService.deCodeJwt(user);
    if (user) {
      this.setState({
        accountCode: user.accountCode,
      });
    } else {
      this.setState({isLoading: false});
    }
  }

  checkCard(accCode){
    const { dispatch } = this.props

    dispatch(getCard(accCode)).then( () => {
      const { card } = this.props
      console.log(card)
    })

    UserService.CheckCard(accCode).then( async res => {
      if(res.data.isCard){
        await UserService.getCardData(accCode).then( res => {
          this.setState({card : {...this.state.card, cardNumber: `************${res.data.last4Digit}`, cardHolderName:res.data.cardHolderName, expireDate:res.data.cardExpiredDate}, cardType:res.data.cardIssuer.toString()})
        })
        this.setState({isCard: res.data.isCard, isLoading: false})
      }else{
        this.setState({isCard: res.data.isCard, isLoading: false})
      }
    })
  }

  handleSubmit(e) {
    e.preventDefault();
    UserService.AddCard(this.state.card,this.state.accountCode).then( async res =>{
      await this.setState({focus: ''})
      await Alert.getGeneralAlertMsg("success", "Add Crad Successful")
      this.checkCard(this.state.accountCode)
      // this.props.history.push('/');
      // this.props.history.replace("/editprofile/payment");
    },(e) =>{
      console.log(e)
    })
  }


  handleInputFocus = (e) => {
    this.setState({ focus:e.target.name });
  }

  handleInputChange = (e) => {
    const { name, value } = e.target;
    this.setState({ card: {...this.state.card,[name]:value} });
  }

  async handleDel(){
    await Alert.confirmRemove("Card").then( () => {
      UserService.DelCard(this.state.accountCode).then( async res => {
        await this.setState({isCard: false, card:{
            cardNumber: '',
            cardHolderName: '',
            expireDate: '',
            cvc: '',
          }})
        // this.props.history.push('/');
        // this.props.history.replace("/editprofile/payment");
      })
    })
  }

  renderEditPayment() {
    const {card} = this.state
    return (
      <form onSubmit={this.handleSubmit.bind(this)} className="flex flex-col h-full w-full p-10 space-y-5">
        <div>
          <p className="font-PoppinsMedium text-primary">Edit Payment</p>
        </div>
        <hr/>
        <div className="flex flex-col w-full h-full justify-center items-center">
          <div className="flex flex-col w-full h-full justify-center items-center">
            <div className="flex space-y-10 md:space-y-0 flex-col md:flex-row w-full h-1/3 justify-center items-center">
              <div className="flex w-72 h-full items-center justify-center">
                <Cards id="PaymentForm"
                       cvc={card.cvc}
                       expiry={card.expireDate}
                       focused={this.state.focus}
                       name={card.cardHolderName}
                       number={card.cardNumber}
                />
              </div>
              <div className="flex space-y-3 flex-col w-full md:w-1/2 h-full items-center justify-center">
                <input className="p-1 w-8/12 md:w-10/12 focus:outline-none h-9 m-1 border-2 hover:border-blue-400"
                       type="tel"
                       maxLength="16"
                       name="cardNumber"
                       placeholder="Card Number"
                       onChange={this.handleInputChange}
                       onFocus={this.handleInputFocus}/>
                <input className="p-1 w-8/12 md:w-10/12 focus:outline-none h-9 m-1  border-2 hover:border-blue-400"
                       type="text"
                       name="cardHolderName"
                       placeholder="Full Name"
                       onChange={this.handleInputChange}
                       onFocus={this.handleInputFocus}/>
                <div className="flex w-8/12 md:w-10/12 justify-center space-x-3">
                  <input className="p-1 w-1/2 focus:outline-none h-9 border-2 hover:border-blue-400"
                         type="tel"
                         maxLength="4"
                         name="expireDate"
                         placeholder="Expiry"
                         onChange={this.handleInputChange}
                         onFocus={this.handleInputFocus}/>
                  <input className="p-1 w-1/2 focus:outline-none h-9 border-2 hover:border-blue-400"
                         type="tel"
                         name="cvc"
                         maxLength="3"
                         placeholder="CVC"
                         onChange={this.handleInputChange}
                         onFocus={this.handleInputFocus}/>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col w-full justify-center items-center">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 h-10 w-16 rounded-md font-PoppinsMedium text-white">
            Save
          </button>
        </div>
      </form>
    );
  }

  renderPayment() {
    const {card,cardType} = this.state
    return (
      <div className="flex flex-col h-full w-full p-10 space-y-5">
        <div>
          <p className="font-PoppinsMedium text-primary">Edit Payment</p>
        </div>
        <hr/>
        <div className="flex flex-col w-full h-full justify-center items-center">
          <div className="flex flex-col w-full h-full justify-center items-center">
            <div className="flex w-full h-1/3 justify-center items-center">
              <div className="flex w-2/3 h-full items-center justify-center">
                <Cards id="PaymentForm"
                       cvc={''}
                       expiry={card.expireDate}
                       focused={this.state.focus}
                       name={card.cardHolderName}
                       number={card.cardNumber}
                       preview={true}
                       issuer={(cardType ? cardType : '')}
                />
              </div>
              <div className="flex w-1/3 h-full items-center justify-center">
                <span onClick={this.handleDel.bind(this)} className="flex items-center justify-center h-8 w-20 rounded-md font-PoppinsMedium text-white bg-red-500 hover:bg-red-600 cursor-pointer">
                  <p>Delete</p>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  render() {
    const {isCard, isLoading} = this.state
    return (
      isLoading ?
        <div className="flex w-full h-full items-center justify-center">
          <p>Loading..</p>
        </div>
        :
      isCard ? this.renderPayment(): this.renderEditPayment()
    )

  }
}

function mapStateToProps(state) {
  const {user} = state.auth;
  const {card} = state.card;
  return {
    user,
    card
  };
}

export default connect(mapStateToProps)(EditPaymentScreen);
