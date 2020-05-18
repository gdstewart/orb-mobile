import React, { Component } from "react";
import { observer } from "mobx-react";
import { StatusBar, TouchableOpacity, Linking, Image } from "react-native";
import { Container, Content, View, Text, StyleProvider, Icon } from "native-base";
import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import AwesomeAlert from "react-native-awesome-alert";
import { scale } from "react-native-size-matters";
import getTheme from "../../../theme/components";
import AppData from "../../../../res/data/app-data";
import styles from "../../../theme/styles";

@observer
class AboutView extends Component {
	static navigationOptions = {
		title: "About",
		headerStyle: {
			backgroundColor: "#000",
			borderBottomWidth: Math.ceil(scale(1.5) / 2) * 2,
			borderBottomColor: "#FFF"
		},
		headerTintColor: "#fff",
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

	render() {
		return (
			<StyleProvider style={getTheme()}>
				<Container>
					<StatusBar
						barStyle="light-content"
					/>
					<Content>
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
						<View style={styles.aboutInfo}>
							<Text style={styles.aboutInfoHeader}>orb: online radio broadcaster v1.0</Text>
							<Text style={styles.aboutInfoBlurb}>orb is a handy tool that aggregates various online, non-terrestrial radio stations on a single site.</Text>
							<Text style={styles.aboutInfoBlurb}>Data is pulled from public APIs exposed by the various broadcasting softwares that these stations use. As a result, orb only uses radio stations where current stream information could be easily accessed.</Text>
							<Text style={styles.aboutInfoBlurb}>So far the implementation is pretty minimal but someday I'd like to set up notifications so that you can save your favourite shows and be alerted to when they are being broadcasted.</Text>
						</View>
						<ListItem
							alertRef={this.alertRef}
							type="blank" />
						<ListItem
							alertRef={this.alertRef}
							type="link"
							icon="twitter"
							caption="@graemedstewart"
							url="https://twitter.com/graemedstewart" />
						<ListItem
							alertRef={this.alertRef}
							type="link"
							icon="comment-processing"
							caption="Send feedback"
							last
							url={`mailto:${"cadeyeager76@gmail.com"}`} />
						<View style={styles.aboutInfo}>
							<Image source={AppData.isono} style={styles.aboutInfoImage} />
							<Text style={styles.aboutInfoImageCredits}>&copy; Hiroo Isono</Text>
						</View>
					</Content>
				</Container>
			</StyleProvider>
		);
	}
};

class ListItem extends Component {
	constructor(props) {
		super(props);
	}

	_urlError = async () => {
		this.props.alertRef.alert(
			"Could not open URL",
			<View style={styles.alertBodyTextView}>
				<Text style={styles.alertBodyText}>Browser failed to open.</Text>
			</View>,
			[{ text: "OK", onPress: () => { } }]
		)
	}

	_handleWebsiteUrl(url) {
		if (Linking.canOpenURL(url)) {
			Linking.openURL(url);
		} else {
			this._urlError();
		};
	};

	render() {
		if (this.props.type === "link") {
			return (
				<View>
					<TouchableOpacity
						activeOpacity={0.8}
						onPress={() => this._handleWebsiteUrl(this.props.url)}>
						<View style={styles.dropdownListItem}>
							<Icon name={this.props.icon} type="MaterialCommunityIcons" style={this.props.last ? [styles.dropdownListItemIcon, { borderBottomWidth: Math.ceil(scale(1.5) / 2) * 2 }] : styles.dropdownListItemIcon} />
							<View style={styles.dropdownListItemContent}>
								<Text style={styles.dropdownListItemText}>{this.props.caption}</Text>
								<View style={styles.dropdownListItemLinkButton}>
									<Icon name="chevron-right" type="MaterialCommunityIcons" style={styles.dropdownListItemButtonIcon} />
								</View>
							</View>
						</View>
					</TouchableOpacity>
				</View>
			)
		} else {
			return (
				<View style={[styles.dropdownListItem, { height: this.props.height }]}>
					<View style={styles.dropdownListItemBlank} />
				</View>
			)
		}
	}
}

const Navigator = createStackNavigator({
	About: {
		screen: AboutView
	}
});

export default createAppContainer(Navigator);