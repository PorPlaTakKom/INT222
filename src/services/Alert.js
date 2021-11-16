import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

class Alert {
	confirmLogout() {
		return new Promise((resolve) => {
			Swal.fire({
				title: "Are you sure?",
				icon: "warning",
				showCancelButton: true,
				confirmButtonColor: "#3085d6",
				cancelButtonColor: "#d33",
				confirmButtonText: "Logout",
			}).then((result) => {
				if (result.isConfirmed) {
					resolve();
					this.getGeneralAlertMsg("success", "Logout success", "", 1000);
				}
			});
		});
	}

	confirmRemove(msg) {
		return new Promise((resolve) => {
			Swal.fire({
				title: "Are you sure?",
				icon: "warning",
				showCancelButton: true,
				confirmButtonColor: "#C12200",
				cancelButtonColor: "#D3D3D3",
				confirmButtonText: "Remove " + msg,
			}).then((result) => {
				if (result.isConfirmed) {
					resolve();
					this.getGeneralAlertMsg("success", "Remove " + msg, "", 1000);
				}
			});
		});
	}

	getGeneralAlertMsg(icon, titleMsg, textMsg = "", timer = 1500) {
		return MySwal.fire({
			icon: `${icon}`,
			title: `${titleMsg}`,
			text: `${textMsg}`,
			showConfirmButton: false,
			timer: ` ${timer}`,
		});
	}

	getLoginAlertFail() {
		return MySwal.fire({
			icon: "error",
			title: "Oops...",
			text: "Username or password does not match ",
			footer: '<a href="">Reset password?</a>',

		});
	}

	 getLoginAlert() {
		return MySwal.fire({
			icon: "success",
			title: "Login Pass",
			showConfirmButton: false,
			timer: 1000,
		});
	}

	getRegisterAlert() {
		return MySwal.fire({
			icon: "success",
			title: "Register Pass",
			showConfirmButton: false,
			timer: 1500,
		});
	}

	getLoadingScreen() {
		return MySwal.fire({
			title: "Custom width, padding, background.",

			padding: "3em",
			background: "#fff url(/images/trees.png)",
			backdrop: `
            rgba(0,0,123,0.4)
            url("/images/nyan-cat.gif")
            left top
        `,
		});
	}

	getAlertPassword() {
		return MySwal.fire({
			position: "center",
			icon: "warning",
			title: "Relax and try to remember your password",
			showConfirmButton: false,
			timer: 2500,
		});
	}

	async getInputQuantity(){
		let num = 1
		return { value: num } = await Swal.fire({
			title: 'Please specify the number of products.',
			input: 'number',
			inputValue: num,
			showCancelButton: true,
		})
	}
}

export default new Alert();
