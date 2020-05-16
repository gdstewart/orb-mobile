import React, { Component } from "react";
import { Root } from "native-base";
import TrackPlayer from "react-native-track-player";
import AppContainer from "./src/components/AppContainer";
import BackgroundFetch from "react-native-background-fetch";
import NetInfo from "@react-native-community/netinfo";
import RNExitApp from "react-native-exit-app";
import PlaybackStore from "./src/stores/Playback";
import getCurrentShowInfo from "./src/utils/show-fetcher";

export default class App extends Component {
	_restartPlayback = async () => {
		AppStore.mediaPlayerClosed = false;
		AppStore.stationError = false;

		this._setRepeatSpacer();

		if (PlaybackStore.structure.title !== "Offline") {
			await TrackPlayer.add(PlaybackStore.structure);
			await TrackPlayer.play().then(PlaybackStore.stationLoaded = true);
		} else {
			this._stationError();
		}
	}

	_setRepeatSpacer() {
		let s = PlaybackStore.structure.title + "";
		if (s.length >= 25 || s === s.toUpperCase() && s.length >= 20) PlaybackStore.repeatSpacer = 50;
		else PlaybackStore.repeatSpacer = 250 - s.length;
	}

	componentDidMount() {
		this._onStateChanged = TrackPlayer.addEventListener("playback-state", (data) => {
			PlaybackStore.playbackState = data.state;
		})

		BackgroundFetch.configure({
			minimumFetchInterval: 15,
			stopOnTerminate: false,
			startOnBoot: true
		}, async () => {
			NetInfo.fetch().then(async (state) => {
				if (state.isConnected) {
					if (typeof PlaybackStore.structure.id !== "undefined") {
						let show = await getCurrentShowInfo(PlaybackStore.structure.id);
						if (PlaybackStore.structure.title !== show.title) {
							PlaybackStore.structure.title = show.title;
							PlaybackStore.stationLoaded = false;
							await TrackPlayer.reset();
							this._restartPlayback();
						}
					}
				}
			});
			BackgroundFetch.finish(BackgroundFetch.FETCH_RESULT_NEW_DATA);
		});
	}

	componentWillUnmount() {
		this._onStateChanged.remove();
		RNExitApp.exitApp();
	}

	render() {
		return (
			<Root>
				<AppContainer />
			</Root>
		);
	}

}