import React, { Component } from "react";
import { View, Image, TouchableOpacity, Text } from "react-native";
import { Container, StyleProvider, Icon } from "native-base";
import StationStore from "../../../stores/Station";
import FadeInView from "react-native-fade-in-view";
import ActionSheet from "react-native-zhb-actionsheet";
import Spinner from "react-native-loading-spinner-overlay";
import getTheme from "../../../theme/components";
import styles from "../../../theme/styles";
import PlaybackStore from "../../../stores/Playback";
import AppStore from "../../../stores/App";
import StationsData from "../../../../res/data/stations-data";
import getCurrentShowInfo from "../../../utils/show-fetcher";
import { FaStop, FaPlay } from "react-icons/fa";
import { observer } from "mobx-react";

@observer
export default class StationInfoView extends Component {
    static navigationOptions = ({ navigation }) => {
        return {
            title: navigation.state.params.name === "NTS 1" ? "NTS" : navigation.state.params.name,
            headerStyle: {
                backgroundColor: "#000",
                borderBottomWidth: 2,
                borderBottomColor: "#FFF"
            },
            headerTintColor: "#FFF",
            headerTitleStyle: {
                fontWeight: "bold",
                fontFamily: "Authentic_Sans"
            },
            headerLeft: () =>
                <TouchableOpacity
                    activeOpacity={0.6}
                    style={styles.headerButton}
                    onPress={() => {
                        navigation.goBack();
                    }}>
                    <Icon name="arrow-left" type="MaterialCommunityIcons" style={styles.headerIcon} />
                </TouchableOpacity>
            ,
            headerRight: () =>
                <TouchableOpacity
                    activeOpacity={0.6}
                    style={styles.headerButton}
                    /*onPress={}*/>
                    <Icon name="dots-horizontal" type="MaterialCommunityIcons" style={styles.headerIcon} />
                </TouchableOpacity>

        }
    }

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <StyleProvider style={getTheme()}>
                <Container>
                    <Spinner
                        visible={AppStore.loading}
                        overlayColor="rgba(0, 0, 0, 0.5)"
                    />
                    <StationInfo name={this.props.navigation.state.params.name} />
                </Container>
            </StyleProvider>
        )
    }
}

@observer
class StationInfo extends Component {
    constructor(props) {
        super(props);
        var station = StationsData.filter(station => {
            return station.name == props.name;
        });
        this.state = {
            station: station
        };
    }

    render() {
        if (this.props.name === "NTS 1") {
            return (
                <FadeInView style={[styles.section, styles.row]}>
                    <View style={styles.stationInfo}>
                        <View style={styles.stationInfoLogo}
                            /*onPress={() => {
                                if (!StationStore.shows["NTS 1"].loading && !StationStore.shows["NTS 2"].loading && StationStore.shows["NTS 1"].currentShow !== "Offline" && StationStore.shows["NTS 2"].currentShow !== "Offline") {
                                    if ((PlaybackStore.playbackInfo.station === "NTS 1" || PlaybackStore.playbackInfo.station === "NTS 2") && PlaybackStore.playing) {
                                        PlaybackStore.playing = false;
                                        this.setState({
                                            logoHoverState: ""
                                        })
                                    } else {
                                        AppStore.showPopUp = true;
                                    }
                                }
                            }}*/>
                            {/*!StationStore.shows["NTS 1"].loading && !StationStore.shows["NTS 2"].loading && StationStore.shows["NTS 1"].currentShow !== "Offline" && StationStore.shows["NTS 2"].currentShow !== "Offline" ? ((PlaybackStore.playbackInfo.station === "NTS 1" || PlaybackStore.playbackInfo.station === "NTS 2") && PlaybackStore.playing ? <FaStop className="station-info-logo-stop-icon" /> : <FaPlay className={"station-info-logo-play-icon" + this.state.logoHoverState} />) : null*/}
                            <Image source={{ uri: this.state.station[0].image }} style={[styles.stationInfoLogoImage, styles.whiteBorder]} />
                        </View>
                        <Text style={styles.stationInfoShowTitle}>
                            {"Currently playing on NTS 1: " + StationStore.shows["NTS 1"].currentShow}
                        </Text>
                        <Text style={styles.stationInfoShowTitle}>
                            {"Currently playing on NTS 2: " + StationStore.shows["NTS 2"].currentShow}
                        </Text>
                        <Text style={styles.stationInfoDescription}>
                            {this.state.station[0].description}
                        </Text>
                    </View>
                </FadeInView>
            )
        } else {
            return (
                <FadeInView style={[styles.section, styles.row]}>
                    <View style={styles.stationInfo}>
                        <View style={styles.stationInfoLogo}
                            /*onPress={() => {
                                if (!StationStore.shows[this.props.name].loading && StationStore.shows[this.props.name].currentShow !== "Offline") {
                                    if (PlaybackStore.playbackInfo.station === this.props.name && PlaybackStore.playing) {
                                        PlaybackStore.playing = false;
                                        this.setState({
                                            logoHoverState: ""
                                        })
                                    } else {
                                        PlaybackStore.playing = false;
                                        setTimeout(() => {
                                            PlaybackStore.playbackInfo = {
                                                station: this.props.name,
                                                currentShow: StationStore.shows[this.props.name].currentShow,
                                                image: this.state.station[0].image,
                                                streamUrl: this.state.station[0].streamUrl
                                            };
                                            if (!PlaybackStore.playerLoaded)
                                                PlaybackStore.playerLoaded = true;
                                            PlaybackStore.playing = true;
                                        }, 100);
                                    }
                                }
                            }}*/>
                            {/*StationStore.shows[this.props.name].currentShow !== "Offline" ? (PlaybackStore.playbackInfo.station === this.props.name && PlaybackStore.playing ? <FaStop className="station-info-logo-stop-icon" /> : <FaPlay className={"station-info-logo-play-icon" + this.state.logoHoverState} />) : null*/}
                            <Image source={{ uri: this.state.station[0].image }} style={[styles.stationInfoLogoImage, styles.whiteBorder]} />
                        </View>
                        <Text style={styles.stationInfoShowTitle}>
                            {"Currently playing: " + StationStore.shows[this.props.name].currentShow}
                        </Text>
                        <Text style={styles.stationInfoDescription}>
                            {this.state.station[0].description}
                        </Text>
                    </View>
                </FadeInView>
            )
        }
    }
}