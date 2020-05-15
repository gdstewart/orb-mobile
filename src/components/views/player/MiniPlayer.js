import React, { Component } from "react";
import { observer } from "mobx-react";
import { TouchableOpacity, ActivityIndicator, Image, StyleSheet, Easing } from "react-native";
import { Icon, View, Text } from "native-base";
import { withNavigation } from "react-navigation";
import TrackPlayer from "react-native-track-player";
import TextTicker from "react-native-text-ticker";
import * as Animatable from "react-native-animatable";
import AwesomeAlert from "react-native-awesome-alert";
import NetInfo from "@react-native-community/netinfo";
import { ScaledSheet, scale } from "react-native-size-matters";
import PlayerStore from "../../../stores/Player";
import StationStore from "../../../stores/Station";
import AppData from "../../../data/AppData";
import StationsData from "../../../data/StationsData";
import alertStyles from "../../../theme/AlertStyles";
import getCurrentShowName from "../../../utils/ShowFetcher";

@observer
class MiniPlayer extends Component {
	constructor(props) {
		super(props);
		this.alertRef = React.createRef();
	}

	_startPlayer = async (station) => {
		PlayerStore.mediaPlayerClosed = false;
		PlayerStore.stationError = false;
		StationStore.structure.title = await getCurrentShowName(StationsData[station].name);
		StationStore.structure.id = StationsData[station].name;
		StationStore.structure.url = StationsData[station].streamUrl;
		StationStore.structure.artist = StationsData[station].name;
		StationStore.structure.artwork = StationsData[station].image;
		StationStore.structure.album = StationsData[station].websiteUrl;
		StationStore.structure.description = StationsData[station].description;

		this._setRepeatSpacer();

		if (StationStore.structure.title !== "Show not found") {
			await TrackPlayer.add(StationStore.structure);
			await TrackPlayer.play().then(PlayerStore.stationLoaded = true);
		} else {
			this._stationError();
		}
	}

	_networkError = async () => {
		this.alertRef.alert(
			"Connection failed",
			<View style={alertStyles.alertBodyTextView}>
				<Text style={alertStyles.alertBodyText}>Please make sure you are connected to the internet and try again.</Text>
			</View>,
			[{ text: "OK", onPress: () => { PlayerStore.mediaPlayerClosed = true; } }]
		)
		StationStore.structure.title = "Connection failed";
		await TrackPlayer.stop();
		PlayerStore.networkError = true;
	}

	_stationError = async () => {
		this.alertRef.alert(
			"Station offline",
			<View style={alertStyles.alertBodyTextView}>
				<Text style={alertStyles.alertBodyText}>Station is not airing or is inaccessible. Try again later.</Text>
			</View>,
			[{ text: "OK", onPress: () => { } }]
		)
		StationStore.structure.title = "Station offline";
		await TrackPlayer.stop();
		PlayerStore.mediaPlayerClosed = true;
		PlayerStore.stationError = true;
	}

	_setRepeatSpacer() {
		let s = StationStore.structure.title + "";
		if (s.length >= 25 || s === s.toUpperCase() && s.length >= 20) PlayerStore.repeatSpacer = 50;
		else PlayerStore.repeatSpacer = 250 - s.length;
	}

	_togglePlayback = async () => {
		NetInfo.fetch().then(async (state) => {
			if (state.isConnected) {
				if (PlayerStore.playbackState !== TrackPlayer.STATE_BUFFERING && PlayerStore.stationLoaded) {
					if (PlayerStore.playbackState === TrackPlayer.STATE_PAUSED ||
						PlayerStore.playbackState === TrackPlayer.STATE_NONE) {
						if (PlayerStore.mediaPlayerClosed) PlayerStore.mediaPlayerClosed = false;
						await TrackPlayer.reset();
						await this._startPlayer(StationStore.structure.id);
					} else {
						await TrackPlayer.pause();
					}
					PlayerStore.networkError = false;
				}
			} else {
				await this._networkError();
			}
		});
	}

	componentWillUnmount() {
		PlayerStore.networkError = false;
		PlayerStore.stationError = false;
	}

	render() {
		if (!PlayerStore.mediaPlayerClosed) {
			if (PlayerStore.stationLoaded) {
				return (
					<View style={{ backgroundColor: "#fff" }}>
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
							style={styles.miniPlayer}
							activeOpacity={0.8}
							onPress={() =>
								this.props.navigation.navigate("Modal", { name: StationStore.structure.id })}>
							<View style={{ flex: 0.2 }}>
								<Image source={StationStore.structure.artwork} style={styles.miniImage} />
							</View>
							<View style={{ flex: 0.6 }}>
								<TextTicker
									style={styles.tickerText}
									duration={20000}
									loop
									bounce={false}
									repeatSpacer={PlayerStore.repeatSpacer}
									marqueeDelay={2000}
									easing={Easing.inOut(Easing.ease)}>
									{StationStore.structure.title}
								</TextTicker>
								<Text style={styles.stationText}>
									{StationStore.structure.id}
								</Text>
							</View>
							<View style={{ flex: 0.2 }}>
								<TouchableOpacity
									activeOpacity={0.6}
									style={styles.miniStartStopButton}
									onPress={this._togglePlayback}>
									<MiniStartStopIcon />
								</TouchableOpacity>
							</View>
						</TouchableOpacity>
					</View>
				)
			} else {
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
						<View style={styles.miniPlayer}>
							<View style={{ flex: 0.2 }}>
								<Image source={AppData.logo} style={styles.miniImage} />
							</View>
							<View style={{ flex: 0.6 }}>
								<LoadingField />
							</View>
							<View style={{ flex: 0.2 }}>
								<View style={styles.miniStartStopButton}>
									<MiniStartStopIcon />
								</View>
							</View>
						</View>
					</View>
				)
			}
		} else return null;
	}
}

@observer
class LoadingField extends Component {
	render() {
		return <Animatable.Text
			style={styles.loadingText}
			animation="fadeIn"
			iterationCount="infinite"
			direction="alternate">
			Loading...
		</Animatable.Text>;
	}
}

@observer
class MiniStartStopIcon extends Component {
	render() {
		if (PlayerStore.stationLoaded) {
			if (PlayerStore.playbackState === TrackPlayer.STATE_PLAYING)
				return <Icon name="stop-circle-outline" type="MaterialCommunityIcons" style={styles.miniStartStopIcon} />;
			else if (PlayerStore.playbackState === TrackPlayer.STATE_PAUSED || PlayerStore.networkError)
				return <Icon name="play-circle-outline" type="MaterialCommunityIcons" style={styles.miniStartStopIcon} />;
			else
				return <ActivityIndicator animating={true} size="large" color="#fff" style={styles.miniActivityIcon} />;
		} else {
			return <ActivityIndicator animating={true} size="large" color="#fff" style={styles.miniActivityIcon} />;
		}

	}
}

const styles = ScaledSheet.create({
	miniPlayer: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		height: "70@vs",
		backgroundColor: "#000",
		borderColor: "#FFF",
		borderTopWidth: Math.ceil(scale(1.5) / 2) * 2
	},
	miniImage: {
		height: "50@s",
		width: "50@s",
		alignSelf: "center"
	},
	tickerText: {
		fontFamily: "Proxima_Nova",
		fontSize: "14@s",
		fontWeight: "bold",
		color: "#fff"
	},
	loadingText: {
		fontFamily: "Proxima_Nova",
		fontSize: "22@s",
		fontWeight: "bold",
		color: "#fff"
	},
	stationText: {
		fontSize: "12@s"
	},
	miniStartStopButton: {
		alignSelf: "center"
	},
	miniStartStopIcon: {
		color: "#fff",
		fontSize: "52@s",
		top: -1
	},
	miniActivityIcon: {
		alignSelf: "center",
		scaleX: "1.45@s",
		scaleY: "1.45@s"
	}
});

export default withNavigation(MiniPlayer);