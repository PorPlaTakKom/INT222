import React from "react";
import styled from "styled-components";
import { Redirect } from "react-router-dom";
import ImageService from "../services/ImageService";
import demoImg from "../assets/images/prod_img_dummy.jpg";

class ProdCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      prodCode: props.prodCode ? props.prodCode : null,
      title: props.title ? props.title : "null",
      price: props.price ? props.price : 0,
      image: props.image ? props.image : null,
      image_show: undefined,
      isRedirect: false,
      isOfficial: props.official? props.official : false
    };
  }

  componentDidMount() {
    this.getImage();
    this.numberCommaFormat(this.state.price);
  }

  componentWillUnmount() {
    this.setState = (state, callback) => {
      return;
    };
  }

  numberCommaFormat(number) {
    let newFormat = new Intl.NumberFormat("en-US");
    let price = newFormat.format(number);
    this.setState({ price: price });
  }

  getImage() {
    this.setState({ isLoading: true });
    if (this.state.image) {
      ImageService.getImage(this.state.image).then((res) => {
        this.setState({
          image_show: "data:image/*;base64," + new Buffer(res.data, "binary").toString("base64"),
          isLoading: false,
        });
      });
    } else {
      this.setState({ isLoading: false });
    }
  }

  render() {
    const { isRedirect, title, price, image_show, isLoading, prodCode, isOfficial} = this.state;
    return isRedirect ? (
      <Redirect push to={"/productdetail?prodCode=" + prodCode} />
    ) : isLoading ? (
      <Card>
        <div className="flex h-full w-full justify-center mt-2">
          <div className="animate-pulse flex flex-col h-full w-full space-y-1 p-1">
            <span className="flex bg-gray-400 h-40 w-full rounded-t-md"></span>

            <span className="flex justify-center items-center mx-auto bg-gray-400 w-2/5 h-6 rounded-md "></span>

            <span className="flex justify-center items-center mx-auto bg-gray-400 w-3/5 h-6 rounded-md "></span>
          </div>
        </div>
      </Card>
    ) : (
      <Card onClick={() => this.setState({ isRedirect: true })}>
        <div>
          <div className="flex justify-center">
            <Img src={image_show ? image_show : demoImg} alt="prodImg" />
          </div>
        </div>
        <div className="flex flex-col justify-center">
          <Title>{title}</Title>
          <div className={(isOfficial ? "":"hidden")}>
            <Icon className={"material-icons text-green-500 "}>check_circle</Icon>
          </div>
          <Price>{price + " Bath"}</Price>
          {/*<BuyBtn*/}
          {/*	type="button"*/}
          {/*	className="flex justify-center text-white font-PoppinsMedium items-center"*/}
          {/*	onClick={() => console.log('LOL')}*/}
          {/*>*/}
          {/*	Buy*/}
          {/*</BuyBtn>*/}
        </div>
      </Card>
    );
  }
}

const Card = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  background: white;
  width: 200px;
  height: 250px;
  border-radius: 10px;
  padding: 5px;
  box-shadow: 0 0.5px 2px rgb(0 0 0 / 0.2);

  :hover {
    cursor: pointer;
    transform: scale(1.05);
  }
  @media (max-width: 767px) {
    width: 400px;
    height: 220px;
    flex-direction: row;
  }
`;

const Img = styled.img`
  border-radius: 10px 10px 0px 0px;
  padding: 5px;
  width: 240px;
  height: 180px;
  object-fit: scale-down;
  position: relative;
  left: 0px;
  top: 0px;
`;

const Title = styled.p`
  text-align: center;
  font-family: PoppinsMedium;
  font-size: 16px;
`;

const Price = styled.p`
  text-align: center;
  font-family: PoppinsMedium;
  font-size: 16px;
`;

const Icon = styled.span`
  position: absolute;
  display: flex;
  top: 20px;
  left: 12px;
  //font-family: PoppinsMedium;
  //font-size: 18px;
`;

// const BuyBtn = styled.button`
//   display: flex;
//   width: 50px;
//   height: 30px;
//   background-color: #4caf50;
//   border-radius: 5px;
//
//   :hover {
//     background-color: #449547;
//   }
// `;

export default ProdCard;
