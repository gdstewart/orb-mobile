import { Container, Icon, StyleProvider, Text, View } from "native-base";
import { FlatList, Linking, ScrollView, StatusBar, TouchableOpacity } from "react-native";
import React, { Component } from "react";
import { ScaledSheet, scale, verticalScale } from "react-native-size-matters";
import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import AppStore from "../../../stores/App";
import AwesomeAlert from "react-native-awesome-alert";
import { CustomPicker } from "react-native-custom-picker";
import Moment from "moment";
import NetInfo from "@react-native-community/netinfo";
import ScheduleStore from "../../../stores/Schedule";
import Spinner from "react-native-loading-spinner-overlay";
import UserStore from "../../../stores/User";
import alertStyles from "../../../theme/AlertStyles";
import customPickerStyles from "../../../theme/CustomPickerStyles";
import getCurrentSchedule from "../../../utils/ScheduleFetcher";
import getTheme from "../../../theme/components";
import { observer } from "mobx-react";

@observer
class SchedulesView extends Component {
	static navigationOptions = {
		title: "Schedules",
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

	componentDidMount() {
		this.focusListener = this.props.navigation.addListener("didFocus", function () {
			ScheduleStore.weekArray = [
				Moment().add(0, "days").format("dddd, MMMM D"),
				Moment().add(1, "days").format("dddd, MMMM D"),
				Moment().add(2, "days").format("dddd, MMMM D"),
				Moment().add(3, "days").format("dddd, MMMM D"),
				Moment().add(4, "days").format("dddd, MMMM D"),
				Moment().add(5, "days").format("dddd, MMMM D"),
				Moment().add(6, "days").format("dddd, MMMM D")
			];

			let oldData = ScheduleStore.activeStationNames.slice();
			ScheduleStore.activeStationNames =
				UserStore.activeStations.map((station) => station.value.name);
			let data = ScheduleStore.activeStationNames.slice();
			if (oldData.length - 1 !== data.length || !data.includes(ScheduleStore.currentStation) && !data.includes("NTS 1")) {
				this._setStation(-1);
				this._setDayOfWeek(-1);
			}
			if (!data.includes("NTS 2") && data.includes("NTS 1")) {
				data.splice(ScheduleStore.activeStationNames.indexOf("NTS 1") + 1, 0, "NTS 2");
				ScheduleStore.activeStationNames = data;
			}
			if (ScheduleStore.scheduleToView != null) {
				this._setStation(data.indexOf(ScheduleStore.scheduleToView));
				this._setDayOfWeek(-1);
				ScheduleStore.scheduleToView = null;
			}
		}.bind(this));
	}

	_networkError = async () => {
		this.alertRef.alert(
			"Connection failed",
			<View style={alertStyles.alertBodyTextView}>
				<Text style={alertStyles.alertBodyText}>Make sure you are connected to the internet and try again.</Text>
			</View>,
			[{ text: "OK", onPress: () => { } }]
		)
	}

	_setStation = async (index) => {
		if (index !== -1) {
			NetInfo.fetch().then(async (state) => {
				if (state.isConnected) {
					if (index !== -1) {
						AppStore.loading = true;
						ScheduleStore.currentStation = ScheduleStore.activeStationNames[index];
						var schedule = await getCurrentSchedule(ScheduleStore.activeStationNames[index]);
						ScheduleStore.currentSchedule = schedule;
						setTimeout(() => AppStore.loading = false, 100);
					} else {
						ScheduleStore.currentStation = "";
						ScheduleStore.currentSchedule = null;
					}
				} else {
					await this._networkError();
				}
			});
		} else AppStore.loading = false;
	}

	_setDayOfWeek(index) {
		if (index !== -1) {
			NetInfo.fetch().then(async (state) => {
				if (state.isConnected) {
					if (index !== -1) {
						AppStore.loading = true;
						ScheduleStore.currentDayIndex = index;
						setTimeout(() => AppStore.loading = false, 100);
					} else {
						ScheduleStore.currentDayIndex = 0;
					}
				} else {
					await this._networkError();
				}
			});
		} else AppStore.loading = false;
	}

	componentWillUnmount() {
		this.focusListener.remove();
	}

	_renderLeftDropdown() {
		return (
			<View style={{ backgroundColor: "#fff" }}>
				<View style={customPickerStyles.dropdownButtonLeft}>
					<Text
						style={customPickerStyles.dropdownButtonText}
						uppercase={false}
						numberOfLines={1}>
						{ScheduleStore.currentStation === "" ? "Select a station..." : ScheduleStore.currentStation}
					</Text>
					<Icon name="chevron-down" type="MaterialCommunityIcons" style={customPickerStyles.dropdownButtonIcon} />
				</View>
			</View>
		)
	}

	_renderRightDropdown() {
		return (
			<View style={{ backgroundColor: "#fff" }}>
				<View style={customPickerStyles.dropdownButtonRight}>
					<Text
						style={customPickerStyles.dropdownButtonText}
						uppercase={false}
						numberOfLines={1}>
						{Moment().add(ScheduleStore.currentDayIndex, "days").format("ddd, MMM D")}
					</Text>
					<Icon name="chevron-down" type="MaterialCommunityIcons" style={customPickerStyles.dropdownButtonIcon} />
				</View>
			</View>
		)
	}

	_renderOption(settings) {
		if (ScheduleStore.activeStationNames.length > 0 && ScheduleStore.weekArray.length > 0) {
			return (
				<View style={settings.item === ScheduleStore.activeStationNames[0] ||
					settings.item === ScheduleStore.weekArray[0] ? customPickerStyles.modalOptionTop : customPickerStyles.modalOption}>
					<Text style={settings.item === ScheduleStore.currentStation ||
						ScheduleStore.weekArray.indexOf(settings.item) === ScheduleStore.currentDayIndex ? customPickerStyles.modalOptionTextHighlight : customPickerStyles.modalOptionText}>{settings.item}</Text>
				</View>
			)
		}
	}

	_renderTopArrow() {
		return (
			<View style={customPickerStyles.modalArrowTopView}>
				<Icon name="menu-up" type="MaterialCommunityIcons" style={customPickerStyles.modalArrowIcon} />
			</View>
		)
	}

	_renderBottomArrow() {
		return (
			<View style={customPickerStyles.modalArrowBottomView}>
				<Icon name="menu-down" type="MaterialCommunityIcons" style={customPickerStyles.modalArrowIcon} />
			</View>
		)
	}

	render() {
		return (
			<StyleProvider style={getTheme()}>
				<Container>
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
					<Spinner
						visible={AppStore.loading}
						overlayColor="rgba(0, 0, 0, 0.50)"
					/>
					<StatusBar
						barStyle="light-content"
					/>
					<View style={{ height: verticalScale(10) }} />
					<View style={{ justifyContent: "space-evenly", flexDirection: "row" }}>
						<CustomPicker
							options={ScheduleStore.activeStationNames.slice()}
							fieldTemplate={this._renderLeftDropdown}
							optionTemplate={this._renderOption}
							headerTemplate={this._renderTopArrow}
							footerTemplate={this._renderBottomArrow}
							onValueChange={(value) => {
								ScheduleStore.currentSchedule = null;
								this._setStation(ScheduleStore.activeStationNames.indexOf(value));
							}}
							modalAnimationType="fade"
							maxHeight={AppStore.screen.height * 0.6}
							modalStyle={{ width: AppStore.screen.width * 0.7, alignSelf: "center" }}
							scrollViewProps={{ style: { backgroundColor: "#fff" }, showsVerticalScrollIndicator: false }}
						/>
						<CustomPicker
							options={ScheduleStore.weekArray.slice()}
							fieldTemplate={this._renderRightDropdown}
							optionTemplate={this._renderOption}
							headerTemplate={this._renderTopArrow}
							footerTemplate={this._renderBottomArrow}
							onValueChange={(value) => this._setDayOfWeek(ScheduleStore.weekArray.indexOf(value))}
							modalAnimationType="fade"
							maxHeight={AppStore.screen.height * 0.6}
							modalStyle={{ width: AppStore.screen.width * 0.7, alignSelf: "center" }}
							scrollViewProps={{ style: { backgroundColor: "#fff" }, showsVerticalScrollIndicator: false }}
						/>
					</View>
					<ScheduleList />
				</Container>
			</StyleProvider>
		);
	}
};

@observer
class ScheduleList extends Component {
	constructor(props) {
		super(props);
		//this.actionSheetRef = React.createRef();
		this.alertRef = React.createRef();
		this.state = {};
	}

    /*options = [
		{title: "Save show", action: () => {
            this._saveShow(this.state.key);
		}, textStyle: actionSheetStyles.actionSheetText, textViewStyle: actionSheetStyles.actionSheetTextView},
		{title: "Cancel", actionStyle: "cancel", action: () => {

		}, textStyle: actionSheetStyles.actionSheetCancelText, textViewStyle: actionSheetStyles.actionSheetTextView}
	];

	icons = [
		{name: "heart", iconStyle: actionSheetStyles.actionSheetIcon},
		{name: "close", actionStyle: "cancel", iconStyle: actionSheetStyles.actionSheetCancelIcon}
	];*/

	_urlError = async () => {
		this.alertRef.alert(
			"Could not open URL",
			<View style={alertStyles.alertBodyTextView}>
				<Text style={alertStyles.alertBodyText}>Browser failed to open.</Text>
			</View>,
			[{ text: "OK", onPress: () => { } }]
		)
	}

	_handleScheduleURL() {
		if (Linking.canOpenURL(ScheduleStore.currentSchedule)) {
			Linking.openURL(ScheduleStore.currentSchedule);
		} else {
			this._urlError();
		};
	}

	/*
		<ActionSheet
			ref={ref => this.actionSheetRef = ref}
			titles={this.options}
			icons={this.icons}
			separateHeight={2}
			separateColor="#FFF"
			backgroundColor="rgba(0, 0, 0, 0.4)"
			containerStyle={actionSheetStyles.actionSheetContainer}
		/>
	*/

	render() {
		if (ScheduleStore.currentSchedule != null) {
			if (typeof ScheduleStore.currentSchedule !== "string") {
				return (
					<ScrollView style={{ margin: scale(9) }}
						indicatorStyle="white">
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
						<FlatList
							style={{ backgroundColor: "#fff" }}
							data={ScheduleStore.currentSchedule[ScheduleStore.currentDayIndex]}
							keyExtractor={(item, index) => index.toString()}
							renderItem={({ item, index }) =>
								//<TouchableOpacity
								<View
									style={index === ScheduleStore.currentSchedule[ScheduleStore.currentDayIndex].length - 1 ? styles.rowStyleBottom : styles.rowStyle}
									activeOpacity={0.8}
									/*onPress={() => {
										this.state.key = item.key;
										//this.actionSheetRef.show();
										this.alertRef.alert(
											"Save show",
											<View style={alertStyles.alertBodyTextView}>
												<Text style={alertStyles.alertBodyText}>Add this show to your favourites?</Text>
											</View>,
											[
												{ text: "Cancel", onPress: () => {}},
												{ text: "OK", onPress: () => {
													this._saveShow(this.state.key);
												}}
											]
										);
									}}*/>
									<View style={{ flex: 2, justifyContent: "center", padding: scale(10) }}>
										<Text>{item.substr(0, item.indexOf(' '))}</Text>
									</View>
									<View style={{ flex: 7, justifyContent: "center", padding: scale(10) }}>
										<Text numberOfLines={2}>{item.substr(item.indexOf(' ') + 1)}</Text>
									</View>
								</View>
								//</TouchableOpacity>
							}
						/>
					</ScrollView>
				)
			} else {
				return (
					<View style={{ margin: scale(9), backgroundColor: "#fff" }}>
						<TouchableOpacity
							style={[styles.rowStyleBottom, { height: verticalScale(58) }]}
							activeOpacity={0.8}
							onPress={this._handleScheduleURL}>
							<View style={{ flex: 9, justifyContent: "center", padding: scale(10) }}>
								<Text numberOfLines={2}>Visit the {ScheduleStore.currentStation} website to view the schedule.</Text>
							</View>
							<View style={{ flex: 1, justifyContent: "center", padding: scale(10) }}>
								<Icon name="open-in-new" type="MaterialCommunityIcons" style={styles.miniIcon} />
							</View>
						</TouchableOpacity>
					</View>
				)
			}
		} else return null;
	}
}

const styles = ScaledSheet.create({
	spinnerTextStyle: {
		color: "#fff"
	},
	dateText: {
		justifyContent: "center",
		alignItems: "flex-end"
	},
	miniIcon: {
		color: "#fff",
		fontSize: "26@s"
	},
	rowStyle: {
		height: Math.ceil(scale(54) / 2) * 2,
		backgroundColor: "#000",
		borderWidth: Math.ceil(scale(1.5) / 2) * 2,
		borderBottomWidth: 0,
		borderColor: "#333333",
		flexDirection: "row"
	},
	rowStyleBottom: {
		height: Math.ceil(scale(54) / 2) * 2,
		backgroundColor: "#000",
		borderWidth: Math.ceil(scale(1.5) / 2) * 2,
		borderColor: "#333333",
		flexDirection: "row"
	},
})

const Navigator = createStackNavigator({
	Schedules: {
		screen: SchedulesView
	}
});

export default createAppContainer(Navigator);