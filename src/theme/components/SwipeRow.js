import variable from "./../variables/platform";

export default (variables = variable) => {
	const swipeRowTheme = {
		"NativeBase.ListItem": {
			".list": {
				backgroundColor: "#333333",
				borderBottomWidth: 1,
				borderColor: '#000',
			},
			marginLeft: 0,
		},
		"NativeBase.Left": {
			flex: 0,
			alignSelf: null,
			alignItems: null,
			"NativeBase.Button": {
				flex: 1,
				alignItems: "center",
				justifyContent: "center",
				alignSelf: "stretch",
				borderRadius: 0,
				borderBottomWidth: 2,
				borderColor: '#000'
			},
		},
		"NativeBase.Right": {
			flex: 0,
			alignSelf: null,
			alignItems: null,
			"NativeBase.Button": {
				flex: 1,
				alignItems: "center",
				justifyContent: "center",
				alignSelf: "stretch",
				borderRadius: 0,
				borderBottomWidth: 2,
				borderColor: '#000'
			},
		},
		"NativeBase.Button": {
			flex: 1,
			height: null,
			alignItems: "center",
			justifyContent: "center",
			alignSelf: "stretch",
			borderRadius: 0,
			borderBottomWidth: 2,
			borderColor: '#000'
		},
	};

	return swipeRowTheme;
};
