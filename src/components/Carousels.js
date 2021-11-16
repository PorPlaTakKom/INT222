import React, {Component} from 'react';
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import {getAllProd} from "../actions/product/prod";
import {connect} from "react-redux";
import ProdCard from "./ProdCard";

class Carousels extends Component {

  constructor(props) {
    super(props);
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
    this.state = {
      prodName: props.prodName ? props.prodName : null,
      prod: undefined,
      isLoading: true,
      width: 1920,
      isOfficial: props.Official ? props.Official : false
    }
  }

  componentDidMount() {
    this.getProd(this.state.prodName)
    window.addEventListener('resize', this.updateWindowDimensions);
  }
  updateWindowDimensions() {
    this.setState({ width: window.innerWidth});
  }

  componentWillUnmount() {
    this.setState = (state, callback) => {
      return;
    };
  }

  getProd(name) {
    const {dispatch,all_prod} = this.props
    if(all_prod){
      const data = all_prod.all_prod
      if(name){
        this.setState({prod: data.productList.filter(f => f.shop.shopName === name),isLoading:false})
      }else{
        this.setState({prod: data.productList, isLoading:false}) //)
      }

    }else{
      if(name){
        dispatch(getAllProd()).then((res) => {
          const {all_prod} = this.props
          const data = all_prod?.all_prod
          this.setState({prod: data.productList.filter(f => f.shop.shopName === name),isLoading:false})
        })
      }else {
        dispatch(getAllProd()).then(() => {
          const {all_prod} = this.props
          const data = all_prod.all_prod
          this.setState({prod: data.productList})
        },(error) =>{
          console.log(error.response)
        })
      }
    }
  }

  render() {
    const {prod, isLoading,isOfficial} = this.state
    // console.log(prod)
    const responsive = {
      desktop: {
        breakpoint: {max: 1920, min: 1600},
        items: 4.05
      },
      desktop_2: {
        breakpoint: {max: 1600, min: 1024},
        items: 3
      },
      tablet: {
        breakpoint: {max: 1240, min: 768},
        items: 2
      },
      mobile: {
        breakpoint: {max: 768, min: 0},
        items: 1
      }
    };

    return (
      isLoading ? <div className="flex flex-row justify-center items-center w-full h-prodCard">Loading...</div>:
      <div className="flex flex-row justify-center items-center w-full h-full">
        <Carousel className="h-full w-full"
                  swipeable={false}
                  draggable={false}
                  responsive={responsive}
                  infinite={true}
                  autoPlay={true}
                  autoPlaySpeed={2000}
                  centerMode={this.state.width <= 768 ? false : true}
        >
          {prod?.map((p, k) =>
            <div key={k} className="flex h-prodCardMobile md:w-prodCard h-prodCardMobile md:h-prodCard m-3 items-center justify-center">
              <ProdCard prodCode={p.prodCode} title={p.prodName} image={p.productDetailList[0]?.imageList[0]}
                        price={p.productDetailList[0]?.price} official={isOfficial}/>
            </div>
          )}
        </Carousel>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const {all_prod} = state.prod;

  return {
    all_prod
  };
}

export default connect(mapStateToProps)(Carousels);