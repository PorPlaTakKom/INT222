import React from "react";
import {connect} from "react-redux";
import NavBar from "../../components/NavBar";
import AuthService from "../../services/AuthService";
import {Redirect} from "react-router-dom";
import Alert from "../../services/Alert";
import ProdService from "../../services/ProdService";
import ImageService from "../../services/ImageService";
import {uploadimage} from "../../actions/image/image";
import {getColorList} from "../../actions/product/colorList";

class EditProductScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      accountCode: undefined,
      prodCode: undefined,
      isLoading: true,
      isRedirect: false,
      isEdit: false,
      brandList: [],
      colorList: [],
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
      tempProduct: undefined
    };
  }

  async componentDidMount() {
    await this.getUser();
    await this.getBranch();
    await this.getProduct()
  }

  async componentDidUpdate(prevProps, prevState, snapshot) {
    if(prevState.prodPreview.prodBrand !== this.state.prodPreview.prodBrand){
      const { colorList } = this.props
      const colorsList = colorList.filter( i => i.brandName === this.state.prodPreview.prodBrand)
      const data = colorsList[0]?.colorList
      this.setState({colorList: data})
    }
  }

  componentWillUnmount() {
    this.setState = (state, callback) => {
      return;
    };
  }

  async getUser() {
    let {user} = this.props;
    user = AuthService.deCodeJwt(user);
    await AuthService.checkSellerRole().then(async () => {
      await this.setState({accountCode: user.accountCode});
    }, (async e => {
      await Alert.getGeneralAlertMsg('error', 'Don\'t have permission \n to access this page')
      this.setState({isRedirect: true})
    }))

  }

  getBranch(){
    const {dispatch, colorList} = this.props
    if(colorList.length === 0){
      dispatch(getColorList()).then(() => {
        const { colorList } = this.props
        const brand = colorList.map(c => c.brandName)
        this.setState({brandList: brand})
      })
    }else {
      const brand = colorList.map(c => c.brandName)
      this.setState({brandList: brand})
    }
  }

  getProduct() {
    const urlSearchParams = new URLSearchParams(window.location.search);
    const params = Object.fromEntries(urlSearchParams.entries());
    if (params.prodCode) {
      ProdService.getProdToEdit(params.prodCode).then(res => {
        const prod = res.data.productDetailList
        this.setState({prodPreviewList: prod,isLoading: false, prodCode:params.prodCode})
      }, async e => {
        await Alert.getGeneralAlertMsg('error', e.response.data.errorMsg)
        await this.props.history.push("profile")
      })
    }
  }

  handleColorChange(e) {
    this.setState({prodPreview: {...this.state.prodPreview, prodColor: e.target.value}});
    e.target.value = ''
  }

  handlePriceChange(e) {
    this.setState({prodPreview: {...this.state.prodPreview, prodPrice: e.target.value}});
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

  handleBrandNameChange(e) {
    this.setState({prodPreview: {...this.state.prodPreview, prodBrand: e.target.value}});
    e.target.value = ''
  }

  handleProdNameChange(e) {
    this.setState({prodPreview: {...this.state.prodPreview, prodName: e.target.value}});
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
              className={"flex justify-center items-center rounded-md text-white w-24 h-8 " + (imgShow === 3 ? ' bg-gray-500 cursor-not-allowed' : ' bg-blue-500 cursor-pointer')}>Add Image</span>
          </label>
        </div>
        <input type="file" name="image-upload" id="image-upload" accept="image/png,image/jpeg" multiple hidden
               onChange={this.onUploadImg.bind(this)}/>
      </div>
    );
  }

  async onUploadNewImg(prod) {
    let imgName = []
    let tempList = []
    for (let i = 0; i < prod.imgList.length; i++) {
      if (typeof prod.imgList[i] !== "string") {
            const {dispatch} = this.props
            tempList.push(prod.imgList[i])
            // eslint-disable-next-line
            await dispatch(uploadimage(tempList)).then( () => {
              const {img_name} = this.props
              for (const item in img_name) {
                imgName = [...imgName,img_name[item]]
              }
            })
          }
          else {
            imgName = [...imgName,prod.imgList[i]]
          }
    }
    return imgName
  }

  async handleSubmit(e) {
    e.preventDefault();
    let todayDate = new Date().toISOString().slice(0, 10);
    const New = await this.state.prodPreviewList
    console.log(New)
    let prods = []
    for (const Key in New) {
      // eslint-disable-next-line
      await this.onUploadNewImg(New[Key]).then( async res => {
        prods = [...prods, {
          prodDetailCode: New[Key].prodDetailCode,
          colorName: New[Key].prodColor,
          prodPrice: New[Key].prodPrice,
          sellDate: todayDate,
          imgName: res,
          quantity: New[Key].prodQuantity,
          warranty: New[Key].prodWarranty
        }]
      })
    }
    await ProdService.upDateProd(New[0].prodName,prods).then(async () =>{
      await Alert.getGeneralAlertMsg('success','Update products success')
      this.props.history.push("/profile")
    }, (e)=>{
      Alert.getGeneralAlertMsg('error',e.response.data.errorMsg)
      console.log(e.response)
    })
  }


  async handleCancelProd() {
    await this.setState({prodPreviewList: [this.state.tempProduct, ...this.state.prodPreviewList]})
    this.setState({
      prodPreview: {
        prodBrand: 'Select Brand',
        prodName: '',
        prodColor: '',
        prodPrice: '',
        prodQuantity: '',
        prodWarranty: '',
        prodDescription: '',
        imgList: [],
        prodImageShow: []
      },
      isEdit: !this.state.isEdit
    })
  }

  async handleSaveProd() {
    await this.setState({prodPreviewList: [this.state.prodPreview, ...this.state.prodPreviewList]})
    this.setState({
      prodPreview: {
        prodBrand: 'Select Brand',
        prodName: '',
        prodColor: '',
        prodPrice: '',
        prodQuantity: '',
        prodWarranty: '',
        prodDescription: '',
        imgList: [],
        prodImageShow: []
      },
      isEdit: !this.state.isEdit
    })
  }

  async handleEditProd(prod) {
    const prodEdit = this.state.prodPreviewList[prod]
    const image = prodEdit.imgList
    this.setState({isLoading: true})
    await this.setState({tempProduct: prodEdit})
    if (prodEdit.prodImageShow) {
      await this.setState({prodPreview: {imgList: prodEdit.imgList, prodImageShow: prodEdit.prodImageShow}})
    } else {
      for (const imageKey in image) {
        await ImageService.getImage(image[imageKey]).then(async (res) => {
          let blob = new Blob(
            [res.data],
            { type: res.headers['content-type'] }
          )
          let image = URL.createObjectURL(blob)
          await this.setState({
            prodPreview: {
              imgList: prodEdit.imgList,
              prodImageShow: [...this.state.prodPreview.prodImageShow, image]
            }
          })
        })
      }
    }
    //prodImageShow: [...this.state.prodPreview.prodImageShow, "data:image/*;base64," + Buffer(res.data, "binary").toString("base64")]
    await this.setState({
      prodPreview: {
        ...this.state.prodPreview,
        prodBrand: prodEdit.prodBrand,
        prodName: prodEdit.prodName,
        prodColor: prodEdit.prodColor,
        prodPrice: prodEdit.prodPrice,
        prodQuantity: prodEdit.prodQuantity,
        prodWarranty: prodEdit.prodWarranty,
        prodDescription: prodEdit.prodDescription,
        prodDetailCode: prodEdit.prodDetailCode
      },
      isEdit: true
    })

    let prodList = [...this.state.prodPreviewList];
    if (prod !== -1) {
      prodList.splice(prod, 1);
      await this.setState({
        prodPreviewList: prodList
      })
    }

    await this.setState({isLoading: false})
  }

  async handleDeleteProd(prod) {
    const prodName = `${this.state.prodPreviewList[prod[0]].prodName}  (${this.state.prodPreviewList[prod[0]].prodColor})`
    let prodList = [...this.state.prodPreviewList];
    Alert.confirmRemove(prodName).then( async ()=>{
      const delProdDetail = {
        accountCode: this.state.accountCode,
        prodDetailCodeList: [prod[1]]
      }

      const delProd = {
        accountCode: this.state.accountCode,
        prodCode: this.state.prodCode
      }

      ProdService.deleteProdDetail(delProdDetail).then( async res => {
        if(res.status === 204){
          if (prod[0] !== -1) {
            prodList.splice(prod[0], 1);
            await this.setState({prodPreviewList: prodList})
          }
          if (this.state.prodPreviewList.length === 0) {
            ProdService.deleteProd(delProd).then( async ()=> {
              await this.setState({
                prodPreview: {
                  ...this.state.prodPreview,
                  prodColor: '',
                  prodPrice: '',
                  prodQuantity: '',
                  prodWarranty: '',
                  prodBrand: 'Apple',
                  imgList: [],
                  prodImageShow: [],
                  prodDescription: []
                }
              })
              setTimeout(()=> { this.props.history.push("profile") }, 1500);
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
      })
    })
  }

  renderForm() {
    const {isEdit, prodPreview, isLoading, prodPreviewList} = this.state
    return (
      <div className={"flex w-screen h-screen min-h-addproductform justify-center"}>
        <div
          className="flex flex-col md:flex-row mt-14 w-full justify-center items-center md:bg-gray-50 bg-none p-3 space-x-3 lg:w-8/12">
          <div className="flex w-full md:w-1/3 h-3/6 md:h-5/6 items-center justify-center mx-auto">
            <div
              className="flex flex-col items-center w-full md:w-4/5 h-full bg-white rounded-md md:shadow-md space-y-3">
              <div className="mt-6">
                <p className="font-PoppinsMedium text-2xl"> Product List </p>
              </div>
              <div className="flex flex-col space-y-3">
                {prodPreviewList?.map((m, c) =>
                  <div key={c} className='flex flex-row justify-start items-center space-x-3'>
                    <div>
                      {m.prodName}
                    </div>
                    <div>
                      {m.prodColor}
                    </div>
                    <div>
                      <span className={"cursor-pointer" + (isEdit ? ' hidden' : '')}
                            onClick={() => this.handleEditProd(c)}>Edit</span>
                    </div>
                    <div>
                      <span className="cursor-pointer" onClick={() => this.handleDeleteProd([c,m.prodDetailCode])}>Delete</span>
                    </div>
                  </div>)}
              </div>
              <div
                className={"absolute flex w-1/6 bottom-32 justify-center space-x-5" + (this.state.prodPreviewList.length > 0 ? '' : ' hidden')}>
                <span
                  className="flex w-28 h-8 bg-yellow-400 hover:bg-yellow-500 justify-center items-center text-white font-PoppinsMedium rounded-md cursor-pointer"
                  onClick={()=> this.props.history.push("/profile")}>Cancel
                </span>
                <span
                  className="flex w-28 h-8 bg-green-400 hover:bg-green-500 justify-center items-center text-white font-PoppinsMedium rounded-md cursor-pointer"
                  onClick={this.handleSubmit.bind(this)}>Save
                </span>
              </div>
            </div>
          </div>
          <div className="flex w-full md:w-2/3 h-full md:h-5/6  items-center justify-center mx-auto pr-10">
            <div className="flex flex-col items-center w-full h-full bg-white rounded-md md:shadow-md p-8">
              <div>
                <div className="md:min-h-desktop ">
                  <div className="flex justify-center items-center mb-5">
                    <p className="font-PoppinsMedium text-2xl">Edit Product</p>
                  </div>
                  <div>
                    {isLoading ? <p>Loading...</p> :
                      <form>
                        <div className='flex flex-row flex-wrap space-y-5 items-center justify-center'>
                          <div className="flex flex-row w-5/6">
                            {/*Brand*/}
                            <div className='flex flex-col w-1/2 justify-center items-center space-y-1'>
                              <label htmlFor="brands" className="font-PoppinsMedium text-medium">Brand</label>
                              <select name="brands" id="brands"
                                      value={prodPreview.prodBrand}
                                      onChange={this.handleBrandNameChange.bind(this)}
                                      disabled={this.state.prodPreviewList.length >= 1 ? true : false}
                              >
                                <option value="Select Brand" disabled="disabled">Select Brand</option>
                                {this.state.brandList.map((m, c) => <option key={c} value={m}>{m}</option>)}
                              </select>
                            </div>
                            {/*ProdName*/}
                            <div className='flex flex-col w-1/2 justify-center items-center'>
                              <label htmlFor="productname"
                                     className="font-PoppinsMedium text-medium">ProductName</label>

                              <input id="productname" name="productname"
                                     value={prodPreview.prodName ? prodPreview.prodName : ""}
                                     className="pl-1 border-2 border-gray-300 w-40 h-8 focus:outline-none"
                                     onChange={this.handleProdNameChange.bind(this)}
                                     disabled={!prodPreview.prodWarranty ? true : false}
                              />
                            </div>
                          </div>
                          <div className="flex flex-row w-5/6">
                            {/*ProdColor*/}
                            <div className='flex flex-col w-1/4 justify-center items-center'>
                              <div className='flex flex-col w-1/2 justify-center items-center'>
                                <label htmlFor="colors" className="font-PoppinsMedium text-medium">Color</label>
                                <select name="colors" id="colors"
                                        value={prodPreview.prodColor}
                                        onChange={this.handleColorChange.bind(this)}
                                        disabled={!prodPreview.prodColor ? true : false}>
                                  <option value="" disabled="disabled">Select Color</option>
                                  {this.state.colorList?.map((m, c) => <option key={c} value={m}>{m}</option>)}
                                </select>
                              </div>
                            </div>
                            {/*ProdPrice*/}
                            <div className='flex flex-col w-1/4 justify-center items-center'>
                              <label htmlFor="price" className="font-PoppinsMedium text-medium">Price</label>
                              <input id="price" name="price" value={prodPreview.prodPrice ? prodPreview.prodPrice : ""}
                                     className="pl-1 border-2 border-gray-300 w-28 h-8 focus:outline-none"
                                     onChange={this.handlePriceChange.bind(this)}
                                     disabled={!prodPreview.prodPrice ? true : false}
                              />
                            </div>
                            {/*ProdQuantity*/}
                            <div className='flex flex-col w-1/4 justify-center items-center'>
                              <label htmlFor="quantity" className="font-PoppinsMedium text-medium">Quantity</label>
                              <input id="quantity" name="quantity"
                                     value={prodPreview.prodQuantity ? prodPreview.prodQuantity : ""}
                                     className="pl-1 border-2 border-gray-300 w-28 h-8 focus:outline-none"
                                     onChange={this.handleQuantityChange.bind(this)}
                                     disabled={prodPreview.prodQuantity !== "" ? false : true}/>
                            </div>
                            {/*ProdWarranty*/}
                            <div className='flex flex-col w-1/4 justify-center items-center'>
                              <label htmlFor="warranty" className="font-PoppinsMedium text-medium">Warranty</label>
                              <input id="warranty" name="warranty"
                                     value={prodPreview.prodWarranty ? prodPreview.prodWarranty : ""}
                                     className="pl-1 border-2 border-gray-300 w-28 h-8 focus:outline-none"
                                     onChange={this.handleWarrantyChange.bind(this)}
                                     disabled={!prodPreview.prodWarranty ? true : false}/>
                            </div>
                          </div>
                          {/*image*/}
                          <div className='flex flex-col w-full justify-center items-center'>
                            {this.renderImages()}
                          </div>
                          {/*ProdDescription*/}
                          <div className='flex flex-col w-full justify-center items-center'>
                            <label htmlFor="description" className="font-PoppinsMedium text-medium">Description</label>
                            <textarea id="description" name="description"
                                      value={prodPreview.prodDescription ? prodPreview.prodDescription : ""}
                                      className="flex w-5/6 h-40 pl-1 border-2 border-gray-300 focus:outline-none"
                                      onChange={this.handleDescriptionChange.bind(this)}
                                      disabled={this.state.prodPreviewList.length >= 1 ? true : false}
                            />
                          </div>
                          <div className="absolute flex bottom-32 justify-center items-center mx-auto">
                            {/*<span className={"flex bg-blue-500 w-28 h-8 justify-center items-center text-white font-PoppinsMedium rounded-md cursor-pointer m-2" + (!isEdit ? '':' hidden')} onClick={this.handleAddColor.bind(this)}>AddToList</span>*/}
                            <span
                              className={"flex bg-yellow-500 w-28 h-8 justify-center items-center text-white font-PoppinsMedium rounded-md cursor-pointer m-2" + (isEdit ? '' : ' hidden')}
                              onClick={this.handleCancelProd.bind(this)}>Cancel</span>
                            <span
                              className={"flex bg-blue-500 w-28 h-8 justify-center items-center text-white font-PoppinsMedium rounded-md cursor-pointer m-2" + (isEdit ? '' : ' hidden')}
                              onClick={this.handleSaveProd.bind(this)}>Save</span>
                          </div>
                        </div>
                      </form>
                    }
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
  const {colorList} = state.colorList;
  return {
    user,
    message,
    img_name,
    prodPreview,
    colorList
  };
}
export default connect(mapStateToProps)(EditProductScreen);