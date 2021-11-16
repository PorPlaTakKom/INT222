import React from "react";
import { Redirect } from "react-router-dom";
import AuthService from "../../services/AuthService";
import UserService from "../../services/UserService";
import { MultiStepForm, Step } from "react-multi-form";
import idCardImg from "../../assets/images/idCard.png";
import idCardWithFaceImg from "../../assets/images/idCardWithFace.png";
import waitingForApproveImg from "../../assets/images/waiting-list.png";
import rejectImage from "../../assets/images/reject.png";
import Alert from "../../services/Alert";
import Validate from "../../components/Validate";
import ShopService from "../../services/ShopService";
import {connect} from "react-redux";

class UpgradeToSellerScreen extends React.Component {
  intervalID;
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      isRedirect: false,
      idCard: "",
      idCard_msg: "",
      selectedIdCardImage: "",
      selectedSelfieImage: "",
      hasIdCardImage: false,
      hasSelfieImage: false,
      previewIdCardImage: "",
      previewSelfieWithIdCardImage: "",
      accountCode: "",
      isReject: false,
      step: 1,
      role: "",
      address: "",
      address_msg: "",
      description: "",
      description_msg: "",
      shopName: "",
      shopName_msg: "",
    };
  }

  async componentDidMount() {
    await this.getUser();
    await this.getApproveStatus();
    await this.checkIsBuyer();
  }

  // componentWillUnmount() {
  //   clearTimeout(this.intervalID);
  // }
  componentWillUnmount() {
    this.setState = (state, callback) => {
      return;
    };
  }

  async getUser() {
    let { user } = this.props;
    user = await AuthService.deCodeJwt(user);
    if (user) {
      this.setState({
        accountCode: user.accountCode,
        role: user.roles[0],
      });
    }
  }

  checkIsBuyer() {
    const { role, step } = this.state;
    if (role === "BUYER" || step !== 4) {
      this.setState({ isLoading: true });
    } else {
      this.setState({ isLoading: false, isRedirect: true });
    }
  }

  async getApproveStatus() {
    await UserService.getApproveStatus(this.state.accountCode)
      .then(async (res) => {
        if (res.data.requestStatus === "REJECT") {
          this.setState({ isReject: true });
        }
        this.setState({ step: res.data.step });
          // this.intervalID = setTimeout(this.getApproveStatus.bind(this), 5000);
      })
      .catch(() => {
        this.setState({ step: 1 });
      });
  }

  prevStep() {
    this.setState({
      step: this.state.step - 1,
      isReject: false,
    });
  }

  onChangeIDCard(e) {
    let idCard = e.target.value;
    this.setState({ idCard: idCard });

    if (Validate.getValidateNationalID(idCard)) {
      this.setState({ idCard_msg: "" });
    } else {
      this.setState({
        idCard_msg: "The national identity document must have 13 digits.",
      });
    }
  }

  onChangeIdCardImg(e) {
    this.setState({
      selectedIdCardImage: e.target.files[0],
      hasIdCardImage: true,
    });

    const reader = new FileReader();
    reader.onload = () => {
      if (reader.readyState === 2) {
        this.setState({ previewIdCardImage: reader.result });
      }
    };
    if (e.target.files[0]) {
      reader.readAsDataURL(e.target.files[0]);
    }
    e.target.value = "";
  }

  onChangeSelfieWithIdCardImg(e) {
    this.setState({
      selectedSelfieImage: e.target.files[0],
      hasSelfieImage: true,
    });
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.readyState === 2) {
        this.setState({ previewSelfieWithIdCardImage: reader.result });
      }
    };
    if (e.target.files[0]) {
      reader.readAsDataURL(e.target.files[0]);
    }
    e.target.value = "";
  }

  onChangeShopName(e) {
    let shopName = e.target.value;
    this.setState({ shopName: shopName });

    if (Validate.getValidateShopName(shopName)) {
      this.setState({ shopName_msg: "" });
    } else {
      this.setState({
        shopName_msg:
          "Shop name must not be empty and not more than 35 characters.",
      });
    }
  }

  onChangeDescription(e) {
    let description = e.target.value;
    this.setState({ description: description });

    if (Validate.getGeneralValidate(description)) {
      this.setState({ description_msg: "" });
    } else {
      this.setState({
        description_msg: "Description must not be empty.",
      });
    }
  }

  onChangeAddress(e) {
    let address = e.target.value;
    this.setState({ address: address });

    if (Validate.getGeneralValidate(address)) {
      this.setState({ address_msg: "" });
    } else {
      this.setState({
        address_msg: "Address must not be empty.",
      });
    }
  }

  handleSubmitStep1(e) {
    e.preventDefault();
    const {
      idCard,
      selectedSelfieImage,
      selectedIdCardImage,
      accountCode,
      hasIdCardImage,
      hasSelfieImage,
    } = this.state;
    if (
      Validate.getValidateNationalID(idCard) &&
      hasIdCardImage &&
      hasSelfieImage
    ) {
      let data = [selectedIdCardImage, selectedSelfieImage];
      UserService.sendSellerImage(data).then(async (res) => {
        let sellerData = {
          identificationNumber: idCard,
          imageCard: res.data[0],
          imageSelfie: res.data[1],
        };

        await console.log(res.status);
        await console.log(res.data);
        await UserService.sendSellerInformation(sellerData, accountCode).then(
          async (res) => {
            await console.log("---------------");
            await console.log(res.data);
            await console.log("---------------");
            await this.setState({ step: res.data.step });
          }
        );
      });
    }
  }

  handleSubmitStep3(e) {
    e.preventDefault();
    const { shopName, description, address, accountCode } = this.state;

    if (
      Validate.getValidateShopName(shopName) &&
      Validate.getGeneralValidate(description) &&
      Validate.getGeneralValidate(address)
    ) {
      const shopData = {
        shopName: shopName,
        description: description,
        address: address,
      };
      ShopService.sendBasicShopInformation(shopData, accountCode).then(
        async (res) => {
          await console.log("send info shop  ----------------------");
          await console.log(res);
          await console.log(res.status);
          await console.log("send info shop  ----------------------");
          await this.setState({ step: res.data.step });
          await Alert.getGeneralAlertMsg("success", "Complete");
          await this.setState({ isRedirect: true });
        }
      );
    }
  }

  renderUploadImage() {
    const { previewSelfieWithIdCardImage, previewIdCardImage } = this.state;
    return (
      <div className="w-full space-y-3 md:space-y-0 pt-5 md:flex md:pt-5 md:justify-around ">
        <div className="space-y-2">
          <p className="font-PoppinsMedium text-slight">
            Upload your national ID card image
          </p>
          <div className="h-48 w-48 border-2 hover:opacity-60 relative rounded-lg  ">
            <label htmlFor="idCard-upload">
              <img
                className=" object-contain flex h-48 w-48 rounded-lg "
                src={previewIdCardImage ? previewIdCardImage : idCardImg}
                alt="idCard"
              />

              <p className="font-PoppinsMedium  opacity-0 hover:opacity-100 duration-75 absolute inset-0 z-10 flex justify-center items-center text-2xl text-black cursor-pointer ">
                Upload
              </p>
            </label>
          </div>
        </div>

        <div className=" space-y-2  ">
          <p className="font-PoppinsMedium text-slight">
            Upload your selfie with an ID card
          </p>
          <div className="h-48 w-48 border-2 hover:opacity-60 relative rounded-lg  ">
            <label htmlFor="selfieWithIdCard-upload">
              <img
                className="object-contain flex h-48 w-48 rounded-lg "
                src={
                  previewSelfieWithIdCardImage
                    ? previewSelfieWithIdCardImage
                    : idCardWithFaceImg
                }
                alt="selfieWithIdCard"
              />

              <p className="font-PoppinsMedium opacity-0 hover:opacity-100 duration-75 absolute inset-0 z-10 flex justify-center items-center text-2xl text-black cursor-pointer ">
                Upload
              </p>
            </label>
          </div>
        </div>

        <input
          type="file"
          name="idCard-upload"
          id="idCard-upload"
          accept="image/png,image/jpeg"
          hidden
          onChange={this.onChangeIdCardImg.bind(this)}
        />

        <input
          type="file"
          name="selfieWithIdCard-upload"
          id="selfieWithIdCard-upload"
          accept="image/png,image/jpeg"
          hidden
          onChange={this.onChangeSelfieWithIdCardImg.bind(this)}
        />
      </div>
    );
  }

  renderSellerRegistrationStep1() {
    const { idCard, idCard_msg } = this.state;
    return (
      <form
        onSubmit={this.handleSubmitStep1.bind(this)}
        className="flex flex-col h-full w-full  "
      >
        <div className="flex flex-col w-full h-full items-center space-y-2">
          <div className="flex flex-col w-full">
            <div className="w-full justify-start mb-1">
              <label htmlFor="username">
                <p className="font-PoppinsMedium text-slight">
                  National identification number
                </p>
              </label>
            </div>
            <input
              id="idCard"
              name="idCard"
              type="number"
              value={idCard}
              onChange={this.onChangeIDCard.bind(this)}
              className="pl-2  border-gray-300 border-2 rounded-sm h-10 focus:outline-none hover:border-blue-300 w-full"
            />
            <div
              className={
                "w-5/6 md:w-8/12 justify-start items-center" +
                (idCard_msg ? " flex" : " hidden")
              }
            >
              <p className="text-small font-PoppinsMedium text-red-500">
                {idCard_msg}
              </p>
            </div>
          </div>
        </div>

        {/* Upload Image */}
        {this.renderUploadImage()}
        {/* Upload Image */}

        <div className="flex flex-col w-full justify-center items-center mt-20">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 h-10 w-20 rounded-md font-PoppinsMedium text-white "
          >
            Submit
          </button>
        </div>
      </form>
    );
  }

  renderSellerRegistrationStep2() {
    const { isReject } = this.state;
    return (
      <div className="flex flex-col w-full    ">
        <p
          className={`font-PoppinsMedium pt-2  text-center ${
            isReject ? "text-red-500" : "text-yellow-500"
          } `}
        >
          {isReject ? "Your information was rejected." : "Waiting for approval"}
        </p>
        <img
          src={isReject ? rejectImage : waitingForApproveImg}
          className="w-48 m-10  self-center"
          alt=""
        />
        <div className="flex flex-col w-full justify-center items-center mt-20">
          <button
            onClick={() => this.prevStep()}
            className={` bg-blue-500 hover:bg-blue-600 h-10 w-16 rounded-md font-PoppinsMedium text-white ${
              isReject ? "" : "hidden"
            }`}
          >
            &lt; Prev
          </button>
        </div>
      </div>
    );
  }

  renderSellerRegistrationStep3() {
    return (
      <form
        onSubmit={this.handleSubmitStep3.bind(this)}
        className="flex flex-col h-full w-full  "
      >
        <div className="py-2">
          <p className="font-PoppinsMedium text-primary">
            Add shop information
          </p>
        </div>
        <div className="flex flex-col w-full h-full items-center space-y-2">
          <div className="flex flex-col w-full">
            <div className="w-full justify-start mb-1">
              <label htmlFor="shopName">
                <p className="font-PoppinsMedium text-slight">Shop name</p>
              </label>
            </div>
            <input
              id="shopName"
              name="shopName"
              className="pl-2  border-gray-300 border-2 rounded-sm h-10 focus:outline-none hover:border-blue-300 w-full"
              onChange={this.onChangeShopName.bind(this)}
            />
            <div
              className={
                "w-5/6 md:w-8/12 justify-start items-center" +
                (this.state.shopName_msg ? " flex" : " hidden")
              }
            >
              <p className="text-small font-PoppinsMedium text-red-500">
                {this.state.shopName_msg}
              </p>
            </div>
          </div>

          <div className="flex flex-col w-full">
            <div className="w-full justify-start mb-1">
              <label htmlFor="description">
                <p className="font-PoppinsMedium text-slight">
                  Shop description
                </p>
              </label>
            </div>
            <textarea
              id="description"
              name="description"
              onChange={this.onChangeDescription.bind(this)}
              className="pl-2 resize-none border-gray-300 border-2 rounded-sm h-28 focus:outline-none hover:border-blue-300 w-full"
            />
            <div
              className={
                "w-5/6 md:w-8/12 justify-start items-center" +
                (this.state.description_msg ? " flex" : " hidden")
              }
            >
              <p className="text-small font-PoppinsMedium text-red-500">
                {this.state.description_msg}
              </p>
            </div>
          </div>

          <div className="flex flex-col w-full">
            <div className="w-full justify-start mb-1">
              <label htmlFor="address">
                <p className="font-PoppinsMedium text-slight">Shop address</p>
              </label>
            </div>
            <textarea
              id="address"
              name="address"
              onChange={this.onChangeAddress.bind(this)}
              className="pl-2  resize-none  border-gray-300 border-2 rounded-sm h-28 focus:outline-none hover:border-blue-300 w-full"
            />
            <div
              className={
                "w-5/6 md:w-8/12 justify-start items-center" +
                (this.state.address_msg ? " flex" : " hidden")
              }
            >
              <p className="text-small font-PoppinsMedium text-red-500">
                {this.state.address_msg}
              </p>
            </div>
          </div>
        </div>
        <div className="flex flex-col w-full justify-center items-center mt-20">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 h-10 w-16 rounded-md font-PoppinsMedium text-white"
          >
            Save
          </button>
        </div>
      </form>
    );
  }

  renderSellerRegistrationStep() {
    const { step } = this.state;
    return (
      <div className="w-full h-full p-10 space-y-5">
        <div>
          <p className="font-PoppinsMedium text-primary">Become to seller</p>
        </div>
        <div className="p-2 md:px-6">
          <MultiStepForm accentColor="#009933" activeStep={step}>
            <Step label="Add information">
              {this.renderSellerRegistrationStep1()}
            </Step>
            <Step label="Approval">{this.renderSellerRegistrationStep2()}</Step>
            <Step label="Add shop information">
              {this.renderSellerRegistrationStep3()}
            </Step>
          </MultiStepForm>
        </div>
      </div>
    );
  }

  render() {
    const { isRedirect } = this.state;
    if (isRedirect) {
      return <Redirect to="/home" />;
    } else {
      return (
        <div className="w-full h-full rounded-md md:shadow-md bg-white ">
          {this.renderSellerRegistrationStep()}
        </div>
      );
    }
  }
}

function mapStateToProps(state) {
  const { user } = state.auth;
  return {
    user,
  };
}
export default connect(mapStateToProps)(UpgradeToSellerScreen);