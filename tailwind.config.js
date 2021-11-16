module.exports = {
	purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
	darkMode: false, // or 'media' or 'class'
	theme: {
		extend: {
			animation: {
				'fade-in-down-0': 'fade-in-down 0.5s ease-out',
				'fade-in-down-1': 'fade-in-down 0.7s ease-out',
				'fade-in-down-2': 'fade-in-down 1s ease-out',
				'fade-in-down-3': 'fade-in-down 1.2s ease-out',
			},
			keyframes: {
				'fade-in-down': {
					'0%': {
						opacity: '0',
						transform: 'translateY(-30px)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateY(0)'
					},
				},
			},
			fontFamily: {
				'Poppins': ['Poppins', ''],
				'PoppinsBold': ['PoppinsBold'],
				'PoppinsMedium': ['PoppinsMedium']
			},
			fontSize: {
				'super-small': '10px',
				'small': '12px',
				'slight': '14px',
				'medium': '16px',
				'primary': '18px',
				'large': '22px',
				'sub-header': '24px',
				'header': '28px',
			},
			height: {
				mobile: "768px",
				showImg: "300px",
				prodCard: "270px",
				prodCardAll: "700px",
				prodCardMobile: "220px",
				home: "1800px"
			},
			width: {
				prodCard: "200px",
				prodCardMobile: "400px",
				desktop: "1900px"
			},
			minHeight: {
				header: "150px",
				desktop: "650px",
				productform: "780px",
				addproductform: "1000px",
				showImg: "100px",
				showImgMobile: "50px",
				mobile: "500px",
				footer: "100px",
				banner: "240px",
				detail: "750px"
			},
			maxHeight: {
				desktop: "650px",
				showImg: "200px",
				showImgMobile: "150px",
				checkout: "230px",
				cartlist: "210px",
				mobile: "1000px",
			},
			maxWidth: {
				desktop: "1900px",
				detail: "500px"
			},
			minWidth: {
				editProfile: "250px",
				desktop: "1918px",
				detail: "550px",
				bg: "1700px"
			},
			colors:{
					Prod:{
						black: "#535353",
						blue: "#0080FF",
						white: "#FFFFFF",
						pink: "#FAB1B1",
						violet: "#BCB1FA",
						red:"#F85B5B",
						green: "#55F8AB",
						silver: "#E4E4E4",
					},
			},
			boxShadow: {
				inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.25)',
			}
		},
	},
	variants: {
		extend: {},
	},
	plugins: [],
}
