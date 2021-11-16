import React from "react";
import {connect} from "react-redux";
import NavBar from "../../components/NavBar";
import AuthService from "../../services/AuthService";
import {Redirect} from "react-router-dom";
import Alert from "../../services/Alert";
import {uploadimage} from "../../actions/image/image";
import {uploadprod} from "../../actions/product/prod";
import {DelProdProview, pushProdProview} from "../../actions/product/prodPreview";
import {getColorList} from "../../actions/product/colorList";


class AddProductsScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      isRedirect: false,
      isEdit: false,
      brandList: [],
      colorList: [],
      colorSelected: [],
      accountCode: null,
      prodPreview: {
        prodBrand: 'Select Brand',
        prodName: '',
        prodColor: '',
        prodPrice: '',
        prodQuantity: '',
        prodWarranty: '',
        imgList: [],
        prodImageShow: [],
        prodDescription: ''
      },
      prodPreviewList: [],
    };
  }

  async componentDidMount() {
    await this.getUser();
    await this.getBranch();
    await this.getProdPreview();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevState.prodPreview.prodBrand !== this.state.prodPreview.prodBrand) {
      const {colorList} = this.props
      const colorsList = colorList.filter(i => i.brandName === this.state.prodPreview.prodBrand)
      const data = colorsList[0].colorList
      this.setState({colorList: data})
    }
  }

  componentWillUnmount() {
    this.setState = (state, callback) => {
      return;
    };
  }

  async getUser() {
    await AuthService.checkSellerRole().then(async (res) => {
      if (res.status === 200) {
        let {user} = this.props;
        user = AuthService.deCodeJwt(user);
        await this.setState({accountCode: user.accountCode})
      }
    }, (async e => {
      await Alert.getGeneralAlertMsg('error', 'Don\'t have permission \n to access this page')
      this.setState({isRedirect: true})
    }))
  }

  getBranch() {
    const {dispatch} = this.props
    dispatch(getColorList()).then(() => {
      const {colorList} = this.props
      const brand = colorList.map(c => c.brandName)
      // const brands = brand.filter(f => f !== 'Other')
      this.setState({brandList: brand})
    })
  }

  async getProdPreview() {
    const {prodPreview, dispatch} = this.props
    if (prodPreview) {
      await this.setState({
        prodPreviewList: prodPreview,
        prodPreview: {
          ...this.state.prodPreview,
          prodBrand: prodPreview[0].prodBrand,
          prodName: prodPreview[0].prodName,
          prodColor: '',
          prodPrice: '',
          prodQuantity: '',
          prodWarranty: '',
          imgList: [],
          prodImageShow: [],
          prodDescription: prodPreview[0].prodDescription
        }
      })
    }
    dispatch(DelProdProview())
  }

  handleInputChange(e) {
    this.setState({prodPreview: {...this.state.prodPreview, [e.target.name]: e.target.value}});
    e.target.value = ''
  }

  handleColorChange(e) {
    this.setState({prodPreview: {...this.state.prodPreview, prodColor: e.target.value}});
    e.target.value = ''
  }

  handleQuantityChange(e) {
    this.setState({prodPreview: {...this.state.prodPreview, prodQuantity: e.target.value}});
    e.target.value = ''
  }

  handleWarrantyChange(e) {
    this.setState({prodPreview: {...this.state.prodPreview, prodWarranty: e.target.value}});
    e.target.value = ''
  }

  handleDescriptionChange(e) {
    this.setState({prodPreview: {...this.state.prodPreview, prodDescription: e.target.value.replace(/\n/g, '\n')}});
    e.target.value = ''
  }

  async onUploadImg(e) {
    const img = Array.from(e.target.files)
    if (this.state.prodPreview.prodImageShow.length <= 2 && e.target.files.length <= 3) {
      this.setState({
        prodPreview: {...this.state.prodPreview, imgList: img}
      });
      await img.forEach((img, c) => {
        const reader = new FileReader();
        reader.onload = async () => {
          if (reader.readyState === 2) {
            await this.setState({
              prodPreview: {
                ...this.state.prodPreview,
                prodImageShow: [...this.state.prodPreview.prodImageShow, reader.result]
              }
            });
          }
        };
        reader.readAsDataURL(img);
        e.target.value = "";
      })
    } else {
      Alert.getGeneralAlertMsg('error', 'ImageFull')
    }
  }

  removeImgae(index) {
    let prodImg = [...this.state.prodPreview.imgList];
    let showImg = [...this.state.prodPreview.prodImageShow];
    if (index !== -1) {
      prodImg.splice(index, 1);
      showImg.splice(index, 1);
      this.setState({
        prodPreview: {...this.state.prodPreview, imgList: prodImg, prodImageShow: showImg}
      })
    }
  }

  renderImages() {
    const {prodPreview} = this.state
    const imgShow = prodPreview.prodImageShow
    return (
      <div className='flex flex-col justify-center items-center space-y-5'>
        <div className="flex flex-row w-full space-x-3">
          {imgShow.map((m, c) =>
            <div key={c} className='flex flex-col justify-center items-center'>
              <img src={m} alt='prodImg' className="flex w-auto h-32 object-center mb-5"/>
              <span onClick={() => this.removeImgae(c)}
                    className="flex w-20 h-8 justify-center items-center text-white font-PoppinsMedium bg-red-500 rounded-md cursor-pointer">Remove</span>
            </div>
          )}
        </div>
        <div className={(imgShow.length > 0 ? "" : "flex w-full h-28 justify-center items-center")}>
          <label htmlFor={(imgShow === 3 ? '' : 'image-upload')}>
            <span
              className={"flex justify-center items-center rounded-md text-white w-28 h-8 font-PoppinsMedium text-medium " + (imgShow === 3 ? ' bg-gray-500 cursor-not-allowed' : ' bg-blue-500 cursor-pointer')}>Add Image</span>
          </label>
        </div>
        <input type="file" name="image-upload" id="image-upload" accept="image/png,image/jpeg" multiple hidden
               onChange={this.onUploadImg.bind(this)}/>
      </div>
    );
  }

  async handleSubmit(e) {
    e.preventDefault();
    const {dispatch} = this.props
    let todayDate = new Date().toISOString().slice(0, 10);
    let prod = {
      productName: this.state.prodPreviewList[0].prodName,
      brandName: this.state.prodPreviewList[0].prodBrand,
      ownerCode: this.state.accountCode,
      description: this.state.prodPreviewList[0].prodDescription,
    }
    let prodDetail = []
    for (const p in this.state.prodPreviewList) {
      await dispatch(uploadimage(this.state.prodPreviewList[p].imgList)).then(async () => {
        const {img_name} = await this.props;
        const detail = {
          colorName: this.state.prodPreviewList[p].prodColor,
          imgName: img_name,
          prodPrice: this.state.prodPreviewList[p].prodPrice,
          sellDate: todayDate,
          quantity: this.state.prodPreviewList[p].prodQuantity,
          warranty: this.state.prodPreviewList[p].prodWarranty,
        }
        prodDetail.push(detail)
      })
    }
    dispatch(uploadprod(prod, prodDetail)).then(async () => {
      await Alert.getGeneralAlertMsg("success", "Product has upload!")
      this.props.history.push("profile")
    })
  }

  async handleAddColor() {
    await this.setState({prodPreviewList: [...this.state.prodPreviewList, this.state.prodPreview]})
    const isNumberofColor = (element) => element === this.state.prodPreview.prodColor;
    this.state.colorList.splice(this.state.colorList.findIndex(isNumberofColor), 1)
    this.setState({
      prodPreview: {
        ...this.state.prodPreview,
        prodColor: '',
        prodPrice: '',
        prodQuantity: '',
        prodWarranty: '',
        imgList: [],
        prodImageShow: []
      }
    })
  }

  async handleSaveProd() {
    await this.setState({prodPreviewList: [this.state.prodPreview, ...this.state.prodPreviewList]})
    this.setState({
      prodPreview: {
        ...this.state.prodPreview,
        prodColor: '',
        prodPrice: '',
        prodQuantity: '',
        prodWarranty: '',
        imgList: [],
        prodImageShow: []
      },
      isEdit: !this.state.isEdit
    })
  }

  async handleEditProd(prod) {
    const prodEdit = this.state.prodPreviewList[prod]
    await this.setState({
      prodPreview: {
        ...this.state.prodPreview,
        prodName: prodEdit.prodName,
        prodColor: prodEdit.prodColor,
        prodPrice: prodEdit.prodPrice,
        prodQuantity: prodEdit.prodQuantity,
        prodWarranty: prodEdit.prodWarranty,
        imgList: prodEdit.imgList,
        prodImageShow: prodEdit.prodImageShow
      },
      isEdit: true
    })
    let prodList = [...this.state.prodPreviewList];
    if (prod !== -1) {
      prodList.splice(prod, 1);
      this.setState({
        prodPreviewList: prodList
      })
    }
  }

  async handleDeleteProd(prod) {
    let prodList = [...this.state.prodPreviewList];
    if (prod !== -1) {
      prodList.splice(prod, 1);
      await this.setState({
        prodPreviewList: prodList
      })
    }
    if (this.state.prodPreviewList.length === 0) {
      this.setState({
        prodPreview: {
          ...this.state.prodPreview,
          prodColor: '',
          prodPrice: '',
          prodQuantity: '',
          prodWarranty: '',
          prodBrand: 'Apple',
          prodName: '',
          imgList: [],
          prodImageShow: [],
          prodDescription: []
        }
      })
    } else {
      this.setState({
        prodPreview: {
          prodName: this.state.prodPreviewList[0].prodName,
          prodBrand: 'Apple',
          prodColor: '',
          prodPrice: '',
          prodQuantity: '',
          prodWarranty: '',
          imgList: [],
          prodImageShow: []
        }
      })
    }
  }

  handlePreview() {
    const {dispatch, history} = this.props
    dispatch(pushProdProview(this.state.prodPreviewList)).then(() => {
      history.push('productpreview')
    })
  }

  renderForm() {
    const {isEdit} = this.state
    return (
      <div className={"flex w-screen h-screen min-h-addproductform justify-center"}>
        {/*<div className={"absolute w-full h-full z-40" + (isEditProd ? " " : " hidden")}>*/}
        {/*  <UpdateProductsScreen/>*/}
        {/*</div>*/}
        <div
          className="flex flex-col md:flex-row mt-14 md:mt-14 w-full justify-center items-center md:bg-gray-50 bg-white p-0 md:p-3 space-x-0 md:space-x-3 lg:w-8/12 ">
          <div className="flex w-full h-3/6 md:w-1/3 md:h-5/6 items-center justify-center mx-auto p-5 md:p-0 ">
            <div
              className="relative flex flex-col items-center w-full md:w-4/5 h-full md:bg-white rounded-md md:shadow-md space-y-3">
              <div className="mt-6">
                <p className="font-PoppinsMedium text-2xl"> Product List </p>
              </div>
              <div className="flex flex-col w-full h-full space-y-3 p-3">
                {this.state.prodPreviewList.length > 0 ? this.state.prodPreviewList.map((m, c) =>
                  <div key={c} className='flex flex-row w-full h-auto justify-start items-center space-x-3'>
                    <div className="flex h-full justify-start items-center w-8/12 h-auto">
                      <img src={m.prodImageShow[0]} alt='prodImg'
                           className='flex w-auto h-10 justify-center items-center'/>
                      <div className="flex space-x-2 w-full h-full items-center justify-center">
                        <p>{m.prodName}</p>
                        <p>{m.prodColor}</p>
                      </div>
                    </div>
                    <div className="flex h-full justify-end items-center w-4/12 h-auto space-x-3">
                      <div>
                        <span className={"cursor-pointer" + (isEdit ? ' hidden' : '')}
                              onClick={() => this.handleEditProd(c)}>Edit</span>
                      </div>
                      <div>
                        <span className="cursor-pointer" onClick={() => this.handleDeleteProd(c)}>Delete</span>
                      </div>
                    </div>
                  </div>) : <p className="flex justify-center items-center w-full h-full">NONE</p>}
              </div>
              <div
                className={"static md:absolute flex w-1/6 bottom-32 justify-center space-x-5 " + (this.state.prodPreviewList.length > 0 ? '' : ' hidden')}>
                <span
                  className="flex w-28 h-8 bg-yellow-500 justify-center items-center text-white font-PoppinsMedium rounded-md cursor-pointer "
                  onClick={this.handlePreview.bind(this)}>Preview</span>
                <span
                  className="flex w-28 h-8 bg-green-500 justify-center items-center text-white font-PoppinsMedium rounded-md cursor-pointer"
                  onClick={this.handleSubmit.bind(this)}>AddToShop</span>
              </div>
              <div className="absolute flex w-full items-center left-5 bottom-5 cursor-pointer z-10"
                   onClick={()=> this.props.history.push("/profile")}>
                <span className="material-icons">navigate_before</span>
                <span className="font-PoppinsMedium">Back</span>
              </div>
            </div>
          </div>
          <div className="w-5/6 h-1  md:hidden">
            <hr/>
          </div>
          <div className="flex w-full h-3/6 md:w-2/3 md:h-5/6 items-center justify-center p-5 md:p-0 ">
            <div
              className="flex flex-col items-center w-full h-full bg-none md:bg-white rounded-md md:shadow-md p-8 mr-10">
              <div>
                <div className="min-h-mobile md:min-h-desktop">
                  <div className="flex justify-center items-center mb-5">
                    <p className="font-PoppinsMedium text-2xl">Add Product</p>
                  </div>
                  <div>
                    <form>
                      <div className='flex flex-row flex-wrap space-y-5 items-center justify-center'>
                        <div className="flex flex-col md:flex-row w-full md:w-5/6 justify-center items-center">
                          {/*Brand*/}
                          <div className='flex flex-col w-full md:w-1/2 justify-center items-center space-y-1'>
                            <label htmlFor="brands" className="font-PoppinsMedium text-medium">Brand</label>
                            <select className="w-4/5 md:w-2/3 h-8 focus:outline-none"
                                    name="prodBrand" id="brands"
                                    value={this.state.prodPreview.prodBrand}
                                    onChange={this.handleInputChange.bind(this)}
                                    disabled={this.state.prodPreviewList.length >= 1 ? true : false}
                            >
                              <option value="Select Brand" disabled="disabled">Select Brand</option>
                              {this.state.brandList.map((m, c) => <option key={c} value={m}>{m}</option>)}
                              {/*<option value="Others">Others</option>*/}
                            </select>
                            {/*<input type="text" name="brands" id="brands" value={this.state.prodPreview.prodBrand} onChange={this.handleBrandNameChange.bind(this)}*/}
                            {/*       className={((this.state.brandList.includes(this.state.prodPreview.prodBrand) || (this.state.prodPreview.prodBrand === "Select Brand"))? " hidden" : "flex border-2 border-gray-500 pl-1 ")}/>*/}
                          </div>
                          {/*ProdName*/}
                          <div className='flex flex-col w-full md:w-1/2 justify-center items-center'>
                            <label htmlFor="productname" className="font-PoppinsMedium text-medium">ProductName</label>

                            <input id="productname" name="prodName" value={this.state.prodPreview.prodName}
                                   className="pl-1 border-2 border-gray-300 w-4/5 md:w-40 h-8 focus:outline-none"
                                   onChange={this.handleInputChange.bind(this)}
                                   disabled={this.state.prodPreviewList.length >= 1 ? true : false}
                            />
                          </div>
                        </div>
                        <div className="flex flex-col md:flex-row w-full md:w-5/6 justify-center items-center">
                          {/*ProdColor*/}
                          <div className='flex flex-col w-full md:w-2/4 justify-center items-center'>
                            <div className='flex flex-col w-full md:w-full justify-center items-center'>
                              <label htmlFor="colors" className="font-PoppinsMedium text-medium">Color</label>
                              <select className="w-4/5 md:w-2/3 h-8 focus:outline-none"
                                      name="prodColor" id="colors" value={this.state.prodPreview.prodColor}
                                      onChange={this.handleInputChange.bind(this)}>
                                <option value="" disabled="disabled">Select Color</option>
                                {this.state.colorList?.map((m, c) => <option key={c} value={m}>{m}</option>)}
                              </select>
                            </div>
                          </div>
                          {/*ProdPrice*/}
                          <div className='flex flex-col w-full md:w-1/4 justify-center items-center'>
                            <label htmlFor="price" className="font-PoppinsMedium text-medium">Price</label>
                            <input id="price" name="prodPrice" value={this.state.prodPreview.prodPrice}
                                   className="pl-1 border-2 border-gray-300 w-4/5 md:w-20 h-8 focus:outline-none"
                                   onChange={this.handleInputChange.bind(this)}
                            />
                          </div>
                          {/*ProdQuantity*/}
                          <div className='flex flex-col w-full md:w-1/4 justify-center items-center'>
                            <label htmlFor="quantity" className="font-PoppinsMedium text-medium">Quantity</label>
                            <input id="quantity" name="prodQuantity" value={this.state.prodPreview.prodQuantity}
                                   className="pl-1 border-2 border-gray-300 w-4/5 md:w-20 h-8 focus:outline-none"
                                   onChange={this.handleInputChange.bind(this)}/>
                          </div>
                          {/*ProdWarranty*/}
                          <div className='flex flex-col w-full md:w-1/4 justify-center items-center'>
                            <label htmlFor="warranty" className="font-PoppinsMedium text-medium">Warranty</label>
                            <input id="warranty" name="prodWarranty" value={this.state.prodPreview.prodWarranty}
                                   className="pl-1 border-2 border-gray-300 w-4/5 md:w-20 h-8 focus:outline-none"
                                   onChange={this.handleInputChange.bind(this)}/>
                          </div>
                        </div>
                        {/*image*/}
                        <div className='flex flex-col w-full justify-center items-center'>
                          {this.renderImages()}
                        </div>
                        {/*ProdDescription*/}
                        <div className='flex flex-col w-full justify-center items-center max-h-48'>
                          <label htmlFor="description" className="font-PoppinsMedium text-medium">Description</label>
                          <textarea id="description" name="prodDescription"
                                    value={this.state.prodPreview.prodDescription}
                                    className="flex w-full md:w-5/6 h-40 pl-1 border-2 border-gray-300 focus:outline-none"
                                    onChange={this.handleInputChange.bind(this)}
                                    disabled={this.state.prodPreviewList.length >= 1 ? true : false}
                          />
                        </div>
                        <div className="static md:absolute flex bottom-32 justify-center items-center mx-auto">
                          <span
                            className={"flex bg-blue-500 w-28 h-8 justify-center items-center text-white font-PoppinsMedium rounded-md cursor-pointer m-2" + (!isEdit ? '' : ' hidden')}
                            onClick={this.handleAddColor.bind(this)}>AddToList</span>
                          <span
                            className={"flex bg-yellow-500 w-28 h-8 justify-center items-center text-white font-PoppinsMedium rounded-md cursor-pointer m-2" + (isEdit ? '' : ' hidden')}
                            onClick={this.handleSaveProd.bind(this)}>Cancel</span>
                          <span
                            className={"flex bg-blue-500 w-28 h-8 justify-center items-center text-white font-PoppinsMedium rounded-md cursor-pointer m-2" + (isEdit ? '' : ' hidden')}
                            onClick={this.handleSaveProd.bind(this)}>Save</span>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  render() {
    const {isRedirect} = this.state;
    if (isRedirect) {
      return <Redirect to="profile"/>;
    } else {
      return (
        <div>
          <NavBar currentPage="addproduct"/>
          {this.renderForm()}
        </div>
      )
    }
  }
}

function mapStateToProps(state) {
  const {user} = state.auth;
  const {message} = state.message;
  const {img_name} = state.image;
  const {prodPreview} = state.prodPreview;
  const {colorList} = state.colorList
  return {
    user,
    message,
    img_name,
    prodPreview,
    colorList
  };
}

export default connect(mapStateToProps)(AddProductsScreen);
