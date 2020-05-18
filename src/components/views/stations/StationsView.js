import { Container, StyleProvider } from "native-base";
import React, { Component } from "react";
import { StatusBar } from "react-native";
import { createAppContainer } from "react-navigation";
import { createStackNavigator, TransitionPresets } from "react-navigation-stack";
import { scale } from "react-native-size-matters";
import AppStore from "../../../stores/App";
import StationList from "./StationList";
import StationInfoView from "./StationInfoView";
import AwesomeAlert from "react-native-awesome-alert";
import Spinner from "react-native-loading-spinner-overlay";
import getTheme from "../../../theme/components";
import styles from "../../../theme/styles";
import { observer } from "mobx-react";

@observer
class StationsView extends Component {
	static navigationOptions = {
		title: "Stations",
		headerStyle: {
			backgroundColor: "#000",
			borderBottomWidth: Math.ceil(scale(1.5) / 2) * 2,
			borderBottomColor: "#FFF"
		},
		headerTintColor: "#FFF",
		headerTitleStyle: {
			fontWeight: "bold",
			fontFamily: "Authentic_Sans",
			fontSize: scale(21)
		}
	}

	constructor(props) {
		super(props);
		this.alertRef = React.createRef();
	}

	componentDidMount() {
		this.props.navigation.setParams({
			alertRef: this.alertRef,
			title: "Stations"
		})
	}

	render() {
		return (
			<StyleProvider style={getTheme()}>
				<Container>
					<StatusBar
						barStyle="light-content"
					/>
					<AwesomeAlert
						ref={ref => this.alertRef = ref}
						styles={{
							modalContainer: styles.alertContainer,
							modalView: styles.alertView,
							titleText: styles.alertTitleText,
							buttonContainer: styles.alertButtonContainer,
							buttonText: styles.alertButtonText
						}}
						modalProps={{
							transparent: true,
							animationType: "fade"
						}}
					/>
					<Spinner
						visible={AppStore.loading}
						overlayColor="rgba(0, 0, 0, 0.5)"
					/>
					<StationList />
				</Container>
			</StyleProvider>
		);
	}
};

const Navigator = createStackNavigator({
	Stations: {
		screen: StationsView
	},
	StationInfo: {
		screen: StationInfoView
	}
},
	{
		initialRouteName: "Stations",
		defaultNavigationOptions: {
			...TransitionPresets.SlideFromRightIOS,
			cardStyle: {
				opacity: 1
			},
		},
	}
);

export default createAppContainer(Navigator);