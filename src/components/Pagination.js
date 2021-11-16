import React from 'react';
import ProdService from "../services/ProdService";
import ProdCard from "./ProdCard";
import { Redirect } from "react-router-dom";
import loading_cat from "../assets/images/loading_cat.gif"
import "react-multi-carousel/lib/styles.css";

class Pagination extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			queryParams: {
				pageSize: 10,
				pageNo: 0,
				sortBy: 'prodCode',
				orderBy: 'accending',
				includeOfficial: false
			},
			totalProd: undefined,
			prod: [],
			allPage: undefined,
			isLoading: false,
			isError: false,
			show: true
		}
	}

	componentDidMount() {
		this.fetchProd()
	}

	componentWillUnmount() {
		this.setState = (state, callback) => {
			return;
		};
	}

	fetchProd() {
		const { queryParams } = this.state
		this.setState({ isLoading: true })
		ProdService.getProd(queryParams).then(async (res) => {
			if (res.data.productList.length > 0) {
				await this.setState({ prod: res.data.productList, totalProd: res.data.total, allPage: Math.ceil(res.data.total / queryParams.pageSize), isLoading: false });
			} else {
				await this.setState({ isLoading: false, isError: true });
			}
		}, error => {
			this.setState({ isLoading: false, isError: false });
		});
	}
	async onNextPage() {
		if (this.state.queryParams.pageNo + 1 < this.state.allPage) {
			await this.setState(prevState => ({
				queryParams: { ...prevState.queryParams, pageNo: this.state.queryParams.pageNo + 1 },
			}))
			this.fetchProd();
		}
	}
	async onPrevPage() {
		if (this.state.queryParams.pageNo + 1 <= this.state.allPage && this.state.queryParams.pageNo + 1 > 1) {
			await this.setState(prevState => ({
				queryParams: { ...prevState.queryParams, pageNo: this.state.queryParams.pageNo - 1 },
			}))
			this.fetchProd();
		}
	}

	fetchShopProductList(){
		ProdService.getShopProductList()
	}

	render() {
		const { prod, allPage, isLoading, isError } = this.state
		const { pageNo } = this.state.queryParams
		return (
			isLoading ?
				<div className="flex flex-col w-full h-prodCardAll">
					<div className="flex w-full h-full justify-center items-center">
						<img src={loading_cat} className="w-20 h-20" alt="Loading" />
					</div>
					<div className={"flex w-full h-auto p-3 justify-center space-x-3" + (allPage > 1 ? "" : " hidden")}>
						<div className="cursor-pointer" onClick={()=>this.onPrevPage.bind(this)}>
							<span className={"material-icons" + (((pageNo+1 <= allPage) && (pageNo+1 > 1)) ? "" : " text-gray-500")}>chevron_left</span>
						</div>
						<div>
							<p className="font-PoppinsMedium text-medium">{pageNo+1} | {allPage}</p>
						</div>
						<div className="cursor-pointer" onClick={()=>this.onNextPage.bind(this)}>
							<span className={"material-icons" + (pageNo+1 < allPage ? "" : " text-gray-500")}>chevron_right</span>
						</div>
					</div>
				</div>
				:
				isError ?
					<Redirect to="/error" />
					:
					<div className="flex flex-col w-full h-prodCardAll">
						<div className="flex w-full h-prodCard flex-col md:flex-row flex-nowrap md:flex-wrap mx-auto">
								{prod?.map(p =>
									<div key={p.prodCode} className={"flex h-prodCardMobile md:w-prodCard md:h-prodCard m-1"}>
										<ProdCard prodCode={p.prodCode} title={p.prodName} image={p.productDetailList[0]?.imageList[0]} price={p.productDetailList[0]?.price} />
									</div>
								)}
						</div>
						<div className={"flex w-full h-auto p-3 justify-center space-x-3" + (allPage > 1 ? "" : " hidden")}>
							<div className="cursor-pointer" onClick={this.onPrevPage.bind(this)}>
								<span className={"material-icons" + (((pageNo+1 <= allPage) && (pageNo+1 > 1)) ? "" : " text-gray-500")}>chevron_left</span>
							</div>
							<div>
								<p className="font-PoppinsMedium text-medium">{pageNo+1} | {allPage}</p>
							</div>
							<div className="cursor-pointer" onClick={this.onNextPage.bind(this)}>
								<span className={"material-icons" + (pageNo+1 < allPage ? "" : " text-gray-500")}>chevron_right</span>
							</div>
						</div>
					</div>
		);
	}
}

export default Pagination;
