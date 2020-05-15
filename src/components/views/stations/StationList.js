import React, { Component } from "react";
import { Image, Text, View, Easing, Dimensions, TouchableOpacity } from "react-native";
import { observer, Observer } from "mobx-react";
import { FaStop, FaPlay } from "react-icons/fa";
import FadeInView from "react-native-fade-in-view";
import Spinner from "react-native-spinkit";
import TextTicker from "react-native-text-ticker";
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

    _refreshShows() {
        Object.keys(StationStore.shows).forEach(station => {
            Promise.resolve(getCurrentShowInfo(station, 0)).then(show => {
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
                        <View key={station.name} style={[styles.stationsListItemAlt, styles.whiteBorder, StationStore.shows[station.name].currentShow === "Offline" ? styles.disabled : ""]}>
                            <View style={[styles.stationsListItemLogo]}
                                /*onPress={() => {
                                    if (!StationStore.shows["NTS 1"].loading && !StationStore.shows["NTS 2"].loading && StationStore.shows["NTS 1"].currentShow !== "Offline" && StationStore.shows["NTS 2"].currentShow !== "Offline") {
                                        if ((PlaybackStore.structure.artist === "NTS 1" || PlaybackStore.structure.artist === "NTS 2") && PlaybackStore.playbackState === TrackPlayer.STATE_PLAYING) {
                                            PlaybackStore.playing = false;
                                        } else {
                                            AppStore.showPopUp = true;
                                        }
                                    }
                                }}*/>
                                {/*!StationStore.shows["NTS 1"].loading && !StationStore.shows["NTS 2"].loading && StationStore.shows["NTS 1"].currentShow !== "Offline" && StationStore.shows["NTS 2"].currentShow !== "Offline" ? ((PlaybackStore.structure.artist === "NTS 1" || PlaybackStore.structure.artist === "NTS 2") && PlaybackStore.playing ? <FaStop /> : <FaPlay />) : null*/}
                                <Image source={{ uri: station.image }} style={[styles.stationsListItemLogoImage, styles.whiteBorder]} />
                            </View>
                            {!StationStore.shows[station.name].loading ?
                                <TouchableOpacity activeOpacity={0.6} style={styles.stationsListItemBody} onPress={() => {
                                    this.props.navigation.navigate("StationInfo", { name: station.name })
                                }}>
                                    <FadeInView>
                                        <Text numberOfLines={1} style={styles.stationsListItemShowTitle}>{"1: " + StationStore.shows["NTS 1"].currentShow}</Text>
                                        <Text style={styles.stationsListItemTime}>{StationStore.shows["NTS 1"].time}</Text>
                                        <Text numberOfLines={1} style={styles.stationsListItemShowTitle}>{"2: " + StationStore.shows["NTS 2"].currentShow}</Text>
                                        <Text style={styles.stationsListItemTime}>{StationStore.shows["NTS 2"].time}</Text>
                                    </FadeInView>
                                    <Text style={styles.stationsListItemStationName}>{"NTS"}</Text>
                                </TouchableOpacity>
                                :
                                <View>
                                    <Spinner type="ThreeBounce" color="#FFF" size={20} />
                                    <Text>&nbsp;</Text>
                                    <Spinner type="ThreeBounce" color="#FFF" size={20} />
                                    <Text>&nbsp;</Text>
                                    <Text>{"NTS"}</Text>
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
                        <View key={station.name} style={[styles.stationsListItem, styles.whiteBorder, StationStore.shows[station.name].currentShow === "Offline" ? styles.disabled : ""]}>
                            <View style={[styles.stationsListItemLogo]}
                                /*onPress={() => {
                                    if (!StationStore.shows[station.name].loading && StationStore.shows[station.name].currentShow !== "Offline") {
                                        if (PlaybackStore.structure.artist === station.name && PlaybackStore.playbackState === TrackPlayer.STATE_PLAYING) {
                                            PlaybackStore.playing = false;
                                        } else {
                                            PlaybackStore.playing = false;
                                            setTimeout(() => {
                                                PlaybackStore.playbackInfo = {
                                                    station: station.name,
                                                    currentShow: StationStore.shows[station.name].currentShow,
                                                    image: station.image,
                                                    streamUrl: station.streamUrl
                                                };
                                                if (!PlaybackStore.playerLoaded)
                                                    PlaybackStore.playerLoaded = true;
                                                PlaybackStore.playing = true;
                                            }, 100);
                                        }
                                    }
                                }}*/>
                                {/*!StationStore.shows[station.name].loading && StationStore.shows[station.name].currentShow !== "Offline" ? (PlaybackStore.structure.artist === station.name && PlaybackStore.playbackState === TrackPlayer.STATE_PLAYING ? <FaStop /> : <FaPlay />) : null*/}
                                <Image source={{ uri: station.image }} style={[styles.stationsListItemLogoImage, styles.whiteBorder]} />
                            </View>
                            {!StationStore.shows[station.name].loading
                                ?
                                <TouchableOpacity activeOpacity={0.6} style={styles.stationsListItemBody} onPress={() => {
                                    this.props.navigation.navigate("StationInfo", { name: station.name })
                                }}>
                                    <FadeInView>
                                        <Text numberOfLines={1} style={styles.stationsListItemShowTitle}>{StationStore.shows[station.name].currentShow}</Text>
                                        <Text style={styles.stationsListItemTime}>{StationStore.shows[station.name].time}</Text>
                                    </FadeInView>
                                    <Text style={styles.stationsListItemStationName}>{station.name}</Text>
                                </TouchableOpacity>
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
        AppStore.loading = false;
        this._refreshShows();
        this.interval = setInterval(() => {
            this._refreshShows();
        }, 60000);

    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    render() {
        return (
            <View style={styles.stationsList}>
                <FlatList
                    data={StationStore.stations}
                    renderItem={this._renderItem}
                    keyExtractor={item => item.name} />
            </View>
        )

    }
}

export default withNavigation(StationList);