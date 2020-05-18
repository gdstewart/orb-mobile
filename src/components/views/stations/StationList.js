import React, { Component } from "react";
import { Image, Text, View, Easing, Dimensions, TouchableOpacity } from "react-native";
import { observer, Observer } from "mobx-react";
import { Icon } from "native-base";
import FadeInView from "react-native-fade-in-view";
import Spinner from "react-native-spinkit";
import NetInfo from "@react-native-community/netinfo";
import TrackPlayer from "react-native-track-player";
import AwesomeAlert from "react-native-awesome-alert";
import AppStore from "../../../stores/App";
import PlaybackStore from "../../../stores/Playback";
import StationStore from "../../../stores/Station";
import getCurrentShowInfo from "../../../utils/show-fetcher";
import stationsData from "../../../../res/data/stations-data";
import { withNavigation } from "react-navigation";
import { FlatList } from "react-native-gesture-handler";
import styles from "../../../theme/styles";

@observer
class StationList extends Component {
    constructor(props) {
        super(props);
        StationStore.stations = stationsData.sort(function (a, b) {
            return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
        });
        let data = StationStore.stations.map(station => {
            return {
                key: station.name, value: {
                    loading: true,
                    currentShow: "",
                    time: ""
                }
            };
        });

        let temp = {};
        for (var i = 0; i < data.length; i++) {
            temp[data[i].key] = data[i].value;
        }

        StationStore.shows = temp;
    }

    _launchMiniPlayer = async (station) => {
        NetInfo.fetch().then(async (state) => {
            if (state.isConnected) {
                if (PlaybackStore.playbackState !== TrackPlayer.STATE_PLAYING &&
                    PlaybackStore.playbackState !== TrackPlayer.STATE_PAUSED) {
                    PlaybackStore.stationLoaded = false;
                    setTimeout(async () => {
                        TrackPlayer.destroy();
                        AppStore.mediaPlayerClosed = false;
                        await TrackPlayer.setupPlayer();
                        TrackPlayer.updateOptions({
                            stopWithApp: false,
                            capabilities: [
                                TrackPlayer.CAPABILITY_PLAY,
                                TrackPlayer.CAPABILITY_PAUSE,
                                TrackPlayer.CAPABILITY_STOP
                            ],
                            compactCapabilities: [
                                TrackPlayer.CAPABILITY_PLAY,
                                TrackPlayer.CAPABILITY_PAUSE,
                                TrackPlayer.CAPABILITY_STOP
                            ],
                            playIcon: require("../../../../res/images/player/play.png"),
                            pauseIcon: require("../../../../res/images/player/stop.png"),
                            stopIcon: require("../../../../res/images/player/close.png")
                        });
                        await this._startPlayback(station);
                    }, 400);
                } else if (PlaybackStore.structure.id !== station.name) {
                    PlaybackStore.stationLoaded = false;
                    setTimeout(async () => {
                        await TrackPlayer.reset();
                        await this._startPlayback(station);
                    }, 400);
                }
                AppStore.networkError = false;
            } else {
                await this._networkError();
            }
        });
    }

    _startPlayback = async (station) => {
        AppStore.mediaPlayerClosed = false;
        AppStore.stationError = false;
        PlaybackStore.structure.title = StationStore.shows[station.name].currentShow;
        PlaybackStore.structure.id = station.name;
        PlaybackStore.structure.url = station.streamUrl;
        PlaybackStore.structure.artist = station.name;
        PlaybackStore.structure.artwork = station.image;

        this._setRepeatSpacer();
        if (PlaybackStore.structure.title !== "Offline") {
            await TrackPlayer.add(PlaybackStore.structure);
            await TrackPlayer.play().then(PlaybackStore.stationLoaded = true);
        } else {
            this._stationError();
        }
    }

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

    _setRepeatSpacer() {
        let s = PlaybackStore.structure.title + "";
        if (s.length >= 25 || s === s.toUpperCase() && s.length >= 20) PlaybackStore.repeatSpacer = 50;
        else PlaybackStore.repeatSpacer = 250 - s.length;
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

    _refreshShows() {
        Object.keys(StationStore.shows).forEach(station => {
            Promise.resolve(getCurrentShowInfo(station, 0)).then(show => {
                if (AppStore.networkError && show.title !== "Offline")
                    AppStore.networkError = false;
                StationStore.shows[station].currentShow = show.title;
                StationStore.shows[station].time = show.time;
                StationStore.shows[station].loading = false;
                if (PlaybackStore.structure.artist === station)
                    PlaybackStore.structure.title = show.title;
            });
        })
    }

    _renderItem = ({ item: station }) => {
        if (station.name === "NTS 1") {
            return (
                <Observer>
                    {() =>
                        <View key={station.name} style={[styles.stationsListItemAlt, styles.whiteBorder, StationStore.shows[station.name].currentShow === "Offline" || AppStore.networkError ? styles.disabled : ""]}>
                            <TouchableOpacity style={[styles.stationsListItemLogo]} activeOpacity={StationStore.shows[station.name].currentShow !== "Offline" && !AppStore.networkError ? 0.6 : 1}
                                onPress={() => {
                                    if (!StationStore.shows["NTS 1"].loading && !StationStore.shows["NTS 2"].loading && StationStore.shows["NTS 1"].currentShow !== "Offline" && StationStore.shows["NTS 2"].currentShow !== "Offline" && PlaybackStore.playbackState !== TrackPlayer.STATE_BUFFERING) {
                                        if ((PlaybackStore.structure.artist === "NTS 1" || PlaybackStore.structure.artist === "NTS 2") && (PlaybackStore.playbackState === TrackPlayer.STATE_PLAYING || PlaybackStore.playbackState === TrackPlayer.STATE_PAUSED)) {
                                            this._togglePlayback();
                                        } else {
                                            setTimeout(() => {
                                                TrackPlayer.getState(); // This needs to be here for the media player to work properly, no idea why!!
                                                this._launchMiniPlayer(station);
                                            }, 100);
                                        }
                                    }
                                }}>
                                {!StationStore.shows["NTS 1"].loading && !StationStore.shows["NTS 2"].loading
                                    && StationStore.shows["NTS 1"].currentShow !== "Offline" && StationStore.shows["NTS 2"].currentShow !== "Offline"
                                    && (PlaybackStore.structure.artist === "NTS 1" || PlaybackStore.structure.artist === "NTS 2")
                                    && (PlaybackStore.playbackState !== TrackPlayer.STATE_NONE && PlaybackStore.playbackState !== TrackPlayer.STATE_PAUSED)
                                    ? <Icon name="stop" type="MaterialCommunityIcons" style={styles.stationsListItemLogoStopIcon} />
                                    : null}
                                <Image source={station.image} style={[styles.stationsListItemLogoImage, styles.whiteBorder]} />
                            </TouchableOpacity>
                            {!StationStore.shows[station.name].loading ?
                                <View style={styles.stationsListItemBody}>
                                    <FadeInView>
                                        <TouchableOpacity activeOpacity={StationStore.shows["NTS 1"].currentShow !== "Offline" ? 0.6 : 1} onPress={() => {
                                            if (!StationStore.shows["NTS 1"].loading && StationStore.shows["NTS 1"].currentShow !== "Offline") {
                                                if (PlaybackStore.structure.id === "NTS 1" && (PlaybackStore.playbackState === TrackPlayer.STATE_PLAYING || PlaybackStore.playbackState === TrackPlayer.STATE_PAUSED)) {
                                                    AppStore.loading = true;
                                                    setTimeout(() => {
                                                        this.props.navigation.navigate("StationInfo", { name: "NTS 1" });
                                                    }, 100);
                                                } else {
                                                    setTimeout(() => {
                                                        TrackPlayer.getState(); // This needs to be here for the media player to work properly, no idea why!!
                                                        this._launchMiniPlayer(station);
                                                    }, 100);
                                                }
                                            }
                                        }}>
                                            <Text numberOfLines={1} style={styles.stationsListItemShowTitle}>{"1: " + StationStore.shows["NTS 1"].currentShow}</Text>
                                            <Text style={styles.stationsListItemTime}>{StationStore.shows["NTS 1"].time}</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity activeOpacity={StationStore.shows["NTS 2"].currentShow !== "Offline" ? 0.6 : 1} onPress={() => {
                                            if (!StationStore.shows["NTS 2"].loading && StationStore.shows["NTS 2"].currentShow !== "Offline") {
                                                if (PlaybackStore.structure.id === "NTS 2" && (PlaybackStore.playbackState === TrackPlayer.STATE_PLAYING || PlaybackStore.playbackState === TrackPlayer.STATE_PAUSED)) {
                                                    AppStore.loading = true;
                                                    setTimeout(() => {
                                                        this.props.navigation.navigate("StationInfo", { name: "NTS 1" });
                                                    }, 100);
                                                } else {
                                                    setTimeout(() => {
                                                        TrackPlayer.getState(); // This needs to be here for the media player to work properly, no idea why!!
                                                        this._launchMiniPlayer(StationStore.stations.filter((station) => station.name === "NTS 2")[0]);
                                                    }, 100);
                                                }
                                            }
                                        }}>
                                            <Text numberOfLines={1} style={styles.stationsListItemShowTitle}>{"2: " + StationStore.shows["NTS 2"].currentShow}</Text>
                                            <Text style={styles.stationsListItemTime}>{StationStore.shows["NTS 2"].time}</Text>
                                        </TouchableOpacity>
                                    </FadeInView>
                                    <TouchableOpacity activeOpacity={0.6} style={{ marginTop: "auto" }} onPress={() => {
                                        AppStore.loading = true;
                                        setTimeout(() => {
                                            this.props.navigation.navigate("StationInfo", { name: station.name });
                                        }, 100);
                                    }}>
                                        <Text style={styles.stationsListItemStationName}>{"NTS"}</Text>
                                    </TouchableOpacity>
                                </View>
                                :
                                <View style={styles.stationsListItemBody}>
                                    <Spinner type="ThreeBounce" color="#FFF" size={20} />
                                    <Text>&nbsp;</Text>
                                    <Spinner type="ThreeBounce" color="#FFF" size={20} />
                                    <Text>&nbsp;</Text>
                                    <Text style={styles.stationsListItemStationName}>{"NTS"}</Text>
                                </View>
                            }
                        </View>
                    }
                </Observer>
            );
        } else if (station.name !== "NTS 2") {
            return (
                <Observer>
                    {() =>
                        <View key={station.name} style={[styles.stationsListItem, styles.whiteBorder, StationStore.shows[station.name].currentShow === "Offline" || AppStore.networkError ? styles.disabled : ""]}>
                            <TouchableOpacity style={[styles.stationsListItemLogo]} activeOpacity={StationStore.shows[station.name].currentShow !== "Offline" ? 0.6 : 1}
                                onPress={() => {
                                    if (!StationStore.shows[station.name].loading && StationStore.shows[station.name].currentShow !== "Offline" && PlaybackStore.playbackState !== TrackPlayer.STATE_BUFFERING) {
                                        if (PlaybackStore.structure.id === station.name && (PlaybackStore.playbackState === TrackPlayer.STATE_PLAYING || PlaybackStore.playbackState === TrackPlayer.STATE_PAUSED)) {
                                            this._togglePlayback();
                                        } else {
                                            setTimeout(() => {
                                                TrackPlayer.getState(); // This needs to be here for the media player to work properly, no idea why!!
                                                this._launchMiniPlayer(station);
                                            }, 100);
                                        }
                                    }
                                }}>
                                {!StationStore.shows[station.name].loading && StationStore.shows[station.name].currentShow !== "Offline"
                                    && PlaybackStore.structure.id === station.name && (PlaybackStore.playbackState !== TrackPlayer.STATE_NONE && PlaybackStore.playbackState !== TrackPlayer.STATE_PAUSED)
                                    ? <Icon name="stop" type="MaterialCommunityIcons" style={styles.stationsListItemLogoStopIcon} />
                                    : null}
                                <Image source={station.image} style={[styles.stationsListItemLogoImage, styles.whiteBorder]} />
                            </TouchableOpacity>
                            {!StationStore.shows[station.name].loading
                                ?
                                <View style={styles.stationsListItemBody}>
                                    <FadeInView>
                                        <TouchableOpacity activeOpacity={StationStore.shows[station.name].currentShow !== "Offline" ? 0.6 : 1} onPress={() => {
                                            if (!StationStore.shows[station.name].loading && StationStore.shows[station.name].currentShow !== "Offline") {
                                                if (PlaybackStore.structure.id === station.name && (PlaybackStore.playbackState === TrackPlayer.STATE_PLAYING || PlaybackStore.playbackState === TrackPlayer.STATE_PAUSED)) {
                                                    AppStore.loading = true;
                                                    setTimeout(() => {
                                                        this.props.navigation.navigate("StationInfo", { name: station.name });
                                                    }, 100);
                                                } else {
                                                    setTimeout(() => {
                                                        TrackPlayer.getState(); // This needs to be here for the media player to work properly, no idea why!!
                                                        this._launchMiniPlayer(station);
                                                    }, 100);
                                                }
                                            }
                                        }}>
                                            <Text numberOfLines={1} style={styles.stationsListItemShowTitle}>{StationStore.shows[station.name].currentShow}</Text>
                                            <Text style={styles.stationsListItemTime}>{StationStore.shows[station.name].time}</Text>
                                        </TouchableOpacity>
                                    </FadeInView>
                                    <TouchableOpacity activeOpacity={0.6} style={{ marginTop: "auto" }} onPress={() => {
                                        AppStore.loading = true;
                                        setTimeout(() => {
                                            this.props.navigation.navigate("StationInfo", { name: station.name });
                                        }, 100);
                                    }}>
                                        <Text style={styles.stationsListItemStationName}>{station.name}</Text>
                                    </TouchableOpacity>
                                </View>
                                :
                                <View style={styles.stationsListItemBody}>
                                    <Spinner type="ThreeBounce" color="#FFF" size={20} />
                                    <Text style={styles.stationsListItemStationName}>{station.name}</Text>
                                </View>
                            }
                        </View>
                    }
                </Observer>
            );
        }
    };

    componentDidMount() {
        AppStore.networkError = false;
        AppStore.loading = false;
        this._refreshShows();
        this.interval = setInterval(() => {
            this._refreshShows();
        }, 60000);
        NetInfo.fetch().then(async (state) => {
            if (!state.isConnected) {
                await this._networkError();
            }
        });

    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    render() {
        return (
            <View style={styles.stationsList}>
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
                <FlatList
                    data={StationStore.stations}
                    renderItem={this._renderItem}
                    keyExtractor={item => item.name} />
            </View>
        )

    }
}

export default withNavigation(StationList);