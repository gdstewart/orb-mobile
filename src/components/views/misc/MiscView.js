import React, { Component } from "react";
import { observer } from "mobx-react";
import { StatusBar, TouchableOpacity, Linking, Image } from "react-native";
import { Container, Content, View, Text, StyleProvider, Icon } from "native-base";
import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import AsyncStorage from "@react-native-community/async-storage";
import { CustomPicker } from "react-native-custom-picker";
import AwesomeAlert from "react-native-awesome-alert";
import RNRestart from "react-native-restart";
import TrackPlayer from "react-native-track-player";
import { ScaledSheet, verticalScale, scale } from "react-native-size-matters";
import getTheme from "../../../theme/components";
import StationStore from "../../../stores/Station";
import UserStore from "../../../stores/User";
import AppStore from "../../../stores/App";
import customPickerStyles from "../../../theme/CustomPickerStyles";
import alertStyles from "../../../theme/AlertStyles";
import AppData from "../../../data/AppData";

@observer
class MiscView extends Component {
	static navigationOptions = {
		title: "Misc",
		headerStyle: {
			backgroundColor: "#000",
			borderBottomWidth: Math.ceil(scale(1.5) / 2) * 2,
			borderColor: "#FFF"
		},
		headerTintColor: "#fff",
		headerTitleStyle: {
			fontWeight: "bold",
			fontFamily: "Proxima_Nova",
			fontSize: scale(21)
		}
	}

	constructor(props) {
		super(props);
		this.alertRef = React.createRef();
	}

	_renderDropdownListItem(icon, caption, value, bottom) {
		return (
			<ListItem
				type="setting"
				icon={icon}
				caption={caption}
				value={value}
				bottom={bottom} />
		)
	}

	_renderOption(settings) {
		return (
			<View style={settings.item === StationStore.gridWidthOptions[0] ? customPickerStyles.modalOptionTop : customPickerStyles.modalOption}>
				<Text style={settings.item === UserStore.gridWidth ? customPickerStyles.modalOptionTextHighlight : customPickerStyles.modalOptionText}>{settings.item}</Text>
			</View>
		)
	}

	_renderTopArrow() {
		return (
			<View style={customPickerStyles.modalArrowTopView} />
		)
	}

	_renderBottomArrow() {
		return (
			<View style={customPickerStyles.modalArrowBottomView} />
		)
	}

	_setGridWidth = async (value) => {
		UserStore.gridWidth = value;
		await this._storeGridWidth().then(() => setTimeout(() => {
			TrackPlayer.destroy();
			RNRestart.Restart();
		}, 100));
	}

	_storeGridWidth = async () => {
		try {
			await AsyncStorage.setItem("GRIDWIDTH", JSON.stringify(UserStore.gridWidth));
		} catch (error) {
			console.log("Could not save station grid width");
		}
	}

	_gridWidthRestartAlert = async (value) => {
		if (value !== UserStore.gridWidth) {
			this.alertRef.alert(
				"Restart app?",
				<View style={alertStyles.alertBodyTextView}>
					<Text style={alertStyles.alertBodyText}>Must restart to take effect.</Text>
				</View>,
				[{ text: "Cancel", onPress: () => { } }, { text: "OK", onPress: () => this._setGridWidth(value) }]
			)
		}
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
								modalContainer: alertStyles.alertContainer,
								modalView: alertStyles.alertView,
								titleText: alertStyles.alertTitleText,
								buttonContainer: alertStyles.alertButtonContainer,
								buttonText: alertStyles.alertButtonText
							}}
							modalProps={{
								transparent: true,
								animationType: "fade"
							}}
						/>
						<CustomPicker
							options={StationStore.gridWidthOptions.slice()}
							defaultValue={UserStore.gridWidth}
							fieldTemplate={() => this._renderDropdownListItem("table", "Stations view grid width", UserStore.gridWidth, true)}
							optionTemplate={this._renderOption}
							headerTemplate={this._renderTopArrow}
							footerTemplate={this._renderBottomArrow}
							onValueChange={(value) => this._gridWidthRestartAlert(value)}
							modalAnimationType="fade"
							maxHeight={AppStore.screen.height * 0.6}
							modalStyle={{ width: AppStore.screen.width * 0.4, alignSelf: "center" }}
							scrollViewProps={{ style: { backgroundColor: "#fff" }, showsVerticalScrollIndicator: false }}
						/>
						<ListItem
							type="blank"
							height={verticalScale(30)} />
						<ListItem
							type="link"
							icon="twitter"
							caption="orb on Twitter"
							url="https://twitter.com/orbradioapp" />
						<ListItem
							type="link"
							icon="comment-processing"
							caption="Send feedback"
							url={`mailto:${"cadeyeager76@gmail.com"}`} />
						<ListItem
							type="link"
							icon="paypal"
							caption="Want to help?"
							url="https://twitter.com/orbradioapp"
							donate
							bottom />
						<View style={styles.about}>
							<Image source={AppData.logo} style={styles.logo} />
							<Text>orb v1.0</Text>
							<Text>{"\u00A9"} 2019 Graeme Stewart</Text>
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
		this.alertRef = React.createRef();
	}

	_urlError = async () => {
		this.alertRef.alert(
			"Could not open URL",
			<View style={alertStyles.alertBodyTextView}>
				<Text style={alertStyles.alertBodyText}>Browser failed to open.</Text>
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

	_donateAlert(url) {
		this.alertRef.alert(
			"Want to help?",
			<View style={alertStyles.alertBodyTextView}>
				<Text style={alertStyles.alertBodyText}>Tentative plans for the app include an iOS version, and the ability to save a show and get a reminder when it's about to air.{"\n\n"}If you like using orb, consider sending a bit of money to help out in the development of these and other features!!! </Text>
			</View>,
			[{ text: "Fuck you", onPress: () => { } }, { text: "Yes!!!", onPress: () => this._handleWebsiteUrl(url) }]
		)
	}

	render() {
		if (this.props.type === "setting") {
			return (
				<View style={customPickerStyles.dropdownListItem}>
					<Icon name={this.props.icon} type="MaterialCommunityIcons" style={this.props.bottom ? [customPickerStyles.dropdownListItemIcon, { borderBottomWidth: Math.ceil(scale(1.5) / 2) * 2 }] : customPickerStyles.dropdownListItemIcon} />
					<View style={customPickerStyles.dropdownListItemContent}>
						<Text style={customPickerStyles.dropdownListItemText}>{this.props.caption}</Text>
						<View style={customPickerStyles.dropdownListItemSettingButton}>
							<Text style={customPickerStyles.dropdownListItemButtonText}>{this.props.value}</Text>
							<Icon name="chevron-down" type="MaterialCommunityIcons" style={customPickerStyles.dropdownListItemButtonIcon} />
						</View>
					</View>
				</View>
			)
		} else if (this.props.type === "link") {
			return (
				<View>
					<AwesomeAlert
						ref={ref => this.alertRef = ref}
						styles={{
							modalContainer: alertStyles.alertContainer,
							modalView: alertStyles.alertView,
							titleText: alertStyles.alertTitleText,
							buttonContainer: alertStyles.alertButtonContainer,
							buttonText: alertStyles.alertButtonText
						}}
						modalProps={{
							transparent: true,
							animationType: "fade"
						}}
					/>
					<TouchableOpacity
						activeOpacity={0.8}
						onPress={() => this.props.donate ? this._donateAlert(this.props.url) : this._handleWebsiteUrl(this.props.url)}>
						<View style={customPickerStyles.dropdownListItem}>
							<Icon name={this.props.icon} type="MaterialCommunityIcons" style={this.props.bottom ? [customPickerStyles.dropdownListItemIcon, { borderBottomWidth: Math.ceil(scale(1.5) / 2) * 2 }] : customPickerStyles.dropdownListItemIcon} />
							<View style={customPickerStyles.dropdownListItemContent}>
								<Text style={customPickerStyles.dropdownListItemText}>{this.props.caption}</Text>
								<View style={customPickerStyles.dropdownListItemLinkButton}>
									<Icon name="chevron-right" type="MaterialCommunityIcons" style={customPickerStyles.dropdownListItemButtonIcon} />
								</View>
							</View>
						</View>
					</TouchableOpacity>
				</View>
			)
		} else {
			return (
				<View style={[customPickerStyles.dropdownListItem, { height: this.props.height }]}>
					<View style={customPickerStyles.dropdownListItemBlank} />
				</View>
			)
		}
	}
}

const styles = ScaledSheet.create({
	about: {
		padding: "30@vs",
		paddingTop: "20@vs",
		alignItems: "center"
	},
	logo: {
		width: AppStore.screen.width / 2.5,
		height: AppStore.screen.width / 2.5
	}
});

const Navigator = createStackNavigator({
	Misc: {
		screen: MiscView
	}
});

export default createAppContainer(Navigator);