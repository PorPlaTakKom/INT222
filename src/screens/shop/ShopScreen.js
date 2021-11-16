import React, {Component} from 'react';
import ProdService from "../../services/ProdService";
import NavBar from "../../components/NavBar";

class ShopScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      shopDetail : undefined,
    }
  }

  async componentDidMount() {
    await this.getShopData()
    this.getProdData()
  }

  getShopData(){
    const urlSearchParams = new URLSearchParams(window.location.search);
    const params = Object.fromEntries(urlSearchParams.entries());
    ProdService.getProfile(params.name).then( res =>{
      console.log(res.data)
    })
  }

  getProdData(){
    const urlSearchParams = new URLSearchParams(window.location.search);
    const params = Object.fromEntries(urlSearchParams.entries());
    ProdService.getShopPord(params.name).then( res => {
      console.log(res.data)
    })
  }

  renderShop(){
    return (
      <div className="flex w-screen h-screen justify-center">
        <div className="flex flex-col md:flex-row mt-14 md:mt-14 w-full justify-center items-center md:bg-gray-50 bg-white p-0 md:p-3 space-x-0 md:space-x-3 lg:w-8/12 ">
        </div>
      </div>
    );
  }

  render() {
    return (
      <div>
        <NavBar currentPage="shop"/>
        {this.renderShop()}
      </div>
    );
  }
}

export default ShopScreen;