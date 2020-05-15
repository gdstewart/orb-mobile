import React, { Component } from "react";
import { StatusBar } from "react-native";
import { Container, Text, StyleProvider } from "native-base";
import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import getTheme from "../../../theme/components";

class SavedView extends Component {
	static navigationOptions = {
		title: "Saved",
		headerStyle: {
			backgroundColor: "#000",
			borderBottomWidth: 2,
			borderColor: "#FFF"
		},
		headerTintColor: "#fff",
		headerTitleStyle: {
			fontWeight: "bold",
			fontFamily: "Proxima_Nova"
		}
	}

	render() {
		return (
			<StyleProvider style={getTheme()}>
				<Container>
					<StatusBar
						barStyle="light-content"
					/>
					<Text></Text>
				</Container>
			</StyleProvider>
		);
	}
};

const Navigator = createStackNavigator({
	Saved: {
		screen: SavedView
	}
});

export default createAppContainer(Navigator);