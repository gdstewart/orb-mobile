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
import Spinner from "react-native-loading-spinner-overlay";
import { ScaledSheet, scale } from "react-native-size-matters";
import PlaybackStore from "../../../stores/Playback";
import StationStore from "../../../stores/Station";
import AppStore from "../../../stores/App";
import AppData from "../../../../res/data/app-data";
import styles from "../../../theme/styles";
import getCurrentShowInfo from "../../../utils/show-fetcher";

@observer
class MiniPlayer extends Component {
	constructor(props) {
		super(props);
		this.alertRef = React.createRef();
	}

	_restartPlayback = async () => {
		AppStore.mediaPlayerClosed = false;
		AppStore.stationError = false;

		console.log(PlaybackStore.structure.id);
		this._setRepeatSpacer();

		if (PlaybackStore.structure.title !== "Offline") {
			await TrackPlayer.add(PlaybackStore.structure);
			await TrackPlayer.play().then(PlaybackStore.stationLoaded = true);
		} else {
			this._stationError();
		}
	}

	_networkError = async () => {
		this.alertRef.alert(
			"Connection failed",
			<View style={styles.alertBodyTextView}>
				<Text style={styles.alertBodyText}>Please make sure you are connected to the internet and try again.</Text>
			</View>,
			[{ text: "OK", onPress: () => { AppStore.mediaPlayerClosed = true; } }]
		)
		PlaybackStore.structure.title = "Connection failed";
		await TrackPlayer.stop();
		AppStore.networkError = true;
	}

	_stationError = async () => {
		this.alertRef.alert(
			"Station offline",
			<View style={styles.alertBodyTextView}>
				<Text style={styles.alertBodyText}>Station is not airing or is inaccessible. Try again later.</Text>
			</View>,
			[{ text: "OK", onPress: () => { } }]
		)
		PlaybackStore.structure.title = "Station offline";
		await TrackPlayer.stop();
		AppStore.mediaPlayerClosed = true;
		AppStore.stationError = true;
	}

	_setRepeatSpacer() {
		let s = PlaybackStore.structure.title + "";
		if (s.length >= 25 || s === s.toUpperCase() && s.length >= 20) PlaybackStore.repeatSpacer = 50;
		else PlaybackStore.repeatSpacer = 250 - s.length;
	}

	_togglePlayback = async () => {
		NetInfo.fetch().then(async (state) => {
			if (state.isConnected) {
				if (PlaybackStore.playbackState !== TrackPlayer.STATE_BUFFERING && PlaybackStore.stationLoaded) {
					if (PlaybackStore.playbackState === TrackPlayer.STATE_PAUSED ||
						PlaybackStore.playbackState === TrackPlayer.STATE_NONE) {
						let show = await getCurrentShowInfo(PlaybackStore.structure.id);
						if (PlaybackStore.structure.title !== show.title) {
							PlaybackStore.structure.title = show.title;
							PlaybackStore.stationLoaded = false;
						}
						if (AppStore.mediaPlayerClosed) AppStore.mediaPlayerClosed = false;
						await TrackPlayer.reset();
						await this._restartPlayback();
					} else {
						await TrackPlayer.pause();
					}
					AppStore.networkError = false;
				}
			} else {
				await this._networkError();
			}
		});
	}

	componentWillUnmount() {
		AppStore.networkError = false;
		AppStore.stationError = false;
	}

	render() {
		if (!AppStore.mediaPlayerClosed) {
			if (PlaybackStore.stationLoaded) {
				return (
					<View style={{ backgroundColor: "#FFF" }}>
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
						<TouchableOpacity
							style={styles.miniPlayer}
							activeOpacity={0.8}
							onPress={() => {
								AppStore.loading = true;
								setTimeout(() => {
									this.props.navigation.navigate("StationInfo", { name: PlaybackStore.structure.id });
								}, 100);
							}}>
							<View style={{ flex: 0.2 }}>
								<Image source={PlaybackStore.structure.artwork} style={[styles.miniPlayerImage, styles.whiteBorder]} />
							</View>
							<View style={{ flex: 0.6 }}>
								<TextTicker
									style={styles.miniPlayerTickerText}
									duration={20000}
									loop
									bounce={false}
									repeatSpacer={PlaybackStore.repeatSpacer}
									marqueeDelay={2000}
									easing={Easing.inOut(Easing.ease)}>
									{PlaybackStore.structure.title}
								</TextTicker>
								<Text style={styles.miniPlayerStationText}>
									{PlaybackStore.structure.id}
								</Text>
							</View>
							<View style={{ flex: 0.2 }}>
								<TouchableOpacity
									activeOpacity={0.6}
									style={styles.miniPlayerStartStopButton}
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
						<View style={styles.miniPlayer}>
							<View style={{ flex: 0.2 }}>
								<Image source={AppData.logo} style={styles.miniPlayerImage} />
							</View>
							<View style={{ flex: 0.6 }}>
								<LoadingField />
							</View>
							<View style={{ flex: 0.2 }}>
								<View style={styles.miniPlayerStartStopButton}>
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
			style={styles.miniPlayerLoadingText}
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
		if (PlaybackStore.stationLoaded) {
			if (PlaybackStore.playbackState === TrackPlayer.STATE_PLAYING)
				return <Icon name="stop-circle-outline" type="MaterialCommunityIcons" style={styles.miniPlayerStartStopIcon} />;
			else if (PlaybackStore.playbackState === TrackPlayer.STATE_PAUSED || AppStore.networkError)
				return <Icon name="play-circle-outline" type="MaterialCommunityIcons" style={styles.miniPlayerStartStopIcon} />;
			else
				return <ActivityIndicator animating={true} size="large" color="#fff" style={styles.miniPlayerActivityIcon} />;
		} else {
			return <ActivityIndicator animating={true} size="large" color="#fff" style={styles.miniPlayerActivityIcon} />;
		}

	}
}

export default withNavigation(MiniPlayer);