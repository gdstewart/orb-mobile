import React, { Component } from "react";
import { View, Image, TouchableOpacity, Text, Linking, ScrollView } from "react-native";
import { Container, StyleProvider, Icon } from "native-base";
import StationStore from "../../../stores/Station";
import FadeInView from "react-native-fade-in-view";
import ActionSheet from "react-native-zhb-actionsheet";
import Spinner from "react-native-loading-spinner-overlay";
import getTheme from "../../../theme/components";
import styles from "../../../theme/styles";
import { scale } from "react-native-size-matters";
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
                fontFamily: "Authentic_Sans",
                fontSize: scale(19)
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
                    onPress={() => {
                        navigation.state.params.actionSheetRef.show();
                    }}>
                    <Icon name="dots-horizontal" type="MaterialCommunityIcons" style={styles.headerIcon} />
                </TouchableOpacity>

        }
    }

    constructor(props) {
        super(props);
        var station = StationsData.filter(station => {
            return station.name == this.props.navigation.state.params.name;
        })[0];

        var titles = [];
        var icons = [];
        if (station.websiteUrl != null) {
            titles.push(
                {
                    title: "Homepage", action: () => {
                        this._handleUrl(station.websiteUrl);
                    }, textStyle: styles.actionSheetText, textViewStyle: styles.actionSheetTextView
                },
            );
            icons.push(
                { name: "earth", iconStyle: styles.actionSheetIcon }
            );
        }
        if (station.instagramUrl != null) {
            titles.push(
                {
                    title: "Instagram", action: () => {
                        this._handleUrl(station.instagramUrl);
                    }, textStyle: styles.actionSheetText, textViewStyle: styles.actionSheetTextView
                },
            );
            icons.push(
                { name: "instagram", iconStyle: styles.actionSheetIcon }
            );
        }
        if (station.twitterUrl != null) {
            titles.push(
                {
                    title: "Twitter", action: () => {
                        this._handleUrl(station.twitterUrl);
                    }, textStyle: styles.actionSheetText, textViewStyle: styles.actionSheetTextView
                },
            );
            icons.push(
                { name: "twitter", iconStyle: styles.actionSheetIcon }
            );
        }
        if (station.facebookUrl != null) {
            titles.push(
                {
                    title: "Facebook", action: () => {
                        this._handleUrl(station.facebookUrl);
                    }, textStyle: styles.actionSheetText, textViewStyle: styles.actionSheetTextView
                },
            );
            icons.push(
                { name: "facebook", iconStyle: styles.actionSheetIcon }
            );
        }
        titles.push(
            {
                title: "Cancel", actionStyle: "cancel", action: () => {
                }, textStyle: styles.actionSheetCancelText, textViewStyle: styles.actionSheetTextView
            }
        );
        icons.push(
            { name: "close", actionStyle: "cancel", iconStyle: styles.actionSheetCancelIcon }
        );

        this.actionSheetRef = React.createRef();
        this.alertRef = React.createRef();
        this.state = {
            titles: titles,
            icons: icons,
            station: station
        };
        AppStore.loading = false;
    }

    _handleUrl(url) {
        if (Linking.canOpenURL(url)) {
            Linking.openURL(url);
        } else {
            this._urlError();
        };
    }

    _urlError = async () => {
        /*this.alertRef.alert(
			"Could not open URL",
			<View style={alertStyles.alertBodyTextView}>
    			<Text style={alertStyles.alertBodyText}>Browser failed to open.</Text>
			</View>,
			[{ text: "OK", onPress: () => {} }]
		)*/
    }

    componentDidMount() {
        this.props.navigation.setParams({
            actionSheetRef: this.actionSheetRef
        })
    }

    componentDidUpdate(prevProps) {
        if (prevProps !== this.props) {
            var station = StationsData.filter(station => {
                return station.name == this.props.navigation.state.params.name;
            })[0];

            var titles = [];
            var icons = [];
            if (station.websiteUrl != null) {
                titles.push(
                    {
                        title: "Homepage", action: () => {
                            this._handleUrl(station.websiteUrl);
                        }, textStyle: styles.actionSheetText, textViewStyle: styles.actionSheetTextView
                    },
                );
                icons.push(
                    { name: "earth", iconStyle: styles.actionSheetIcon }
                );
            }
            if (station.instagramUrl != null) {
                titles.push(
                    {
                        title: "Instagram", action: () => {
                            this._handleUrl(station.instagramUrl);
                        }, textStyle: styles.actionSheetText, textViewStyle: styles.actionSheetTextView
                    },
                );
                icons.push(
                    { name: "instagram", iconStyle: styles.actionSheetIcon }
                );
            }
            if (station.twitterUrl != null) {
                titles.push(
                    {
                        title: "Twitter", action: () => {
                            this._handleUrl(station.twitterUrl);
                        }, textStyle: styles.actionSheetText, textViewStyle: styles.actionSheetTextView
                    },
                );
                icons.push(
                    { name: "twitter", iconStyle: styles.actionSheetIcon }
                );
            }
            if (station.facebookUrl != null) {
                titles.push(
                    {
                        title: "Facebook", action: () => {
                            this._handleUrl(station.facebookUrl);
                        }, textStyle: styles.actionSheetText, textViewStyle: styles.actionSheetTextView
                    },
                );
                icons.push(
                    { name: "facebook", iconStyle: styles.actionSheetIcon }
                );
            }
            titles.push(
                {
                    title: "Cancel", actionStyle: "cancel", action: () => {
                    }, textStyle: styles.actionSheetCancelText, textViewStyle: styles.actionSheetTextView
                }
            );
            icons.push(
                { name: "close", actionStyle: "cancel", iconStyle: styles.actionSheetCancelIcon }
            );

            this.setState({
                titles: titles,
                icons: icons,
                station: station
            });
            AppStore.loading = false;
        }
    }

    render() {
        return (
            <StyleProvider style={getTheme()}>
                <Container>
                    <ActionSheet
                        ref={ref => this.actionSheetRef = ref}
                        header={[{ title: null, headerStyle: null, headerViewStyle: null }]}
                        titles={this.state.titles}
                        icons={this.state.icons}
                        separateHeight={Math.ceil(scale(1.5) / 2) * 2}
                        separateColor="#FFF"
                        backgroundColor="rgba(0, 0, 0, 0.6)"
                        containerStyle={styles.actionSheetContainer}
                        onClose={(obj) => { }}
                    />
                    <Spinner
                        visible={AppStore.loading}
                        overlayColor="rgba(0, 0, 0, 0.5)"
                    />
                    <StationInfo name={this.props.navigation.state.params.name} station={this.state.station} />
                </Container>
            </StyleProvider>
        )
    }
}

@observer
class StationInfo extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        if (this.props.name === "NTS 1") {
            return (
                <FadeInView style={[styles.section, styles.row]}>
                    <ScrollView style={styles.stationInfo}>
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
                            <Image source={this.props.station.image} style={[styles.stationInfoLogoImage, styles.whiteBorder]} />
                        </View>
                        <Text style={[styles.stationInfoShowTitle, styles.bold]}>
                            {"Currently playing on NTS 1: "}
                            <Text style={styles.stationInfoShowTitle}>
                                {StationStore.shows["NTS 1"].currentShow}
                            </Text>
                        </Text>
                        <Text style={[styles.stationInfoShowTitle, styles.bold]}>
                            {"Currently playing on NTS 2: "}
                            <Text style={styles.stationInfoShowTitle}>
                                {StationStore.shows["NTS 2"].currentShow}
                            </Text>
                        </Text>
                        <Text style={styles.stationInfoDescription}>
                            {this.props.station.description}
                        </Text>
                    </ScrollView>
                </FadeInView>
            )
        } else {
            return (
                <FadeInView style={[styles.section, styles.row]}>
                    <ScrollView style={styles.stationInfo}>
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
                                                image: this.props.station[0].image,
                                                streamUrl: this.props.station[0].streamUrl
                                            };
                                            if (!PlaybackStore.playerLoaded)
                                                PlaybackStore.playerLoaded = true;
                                            PlaybackStore.playing = true;
                                        }, 100);
                                    }
                                }
                            }}*/>
                            {/*StationStore.shows[this.props.name].currentShow !== "Offline" ? (PlaybackStore.playbackInfo.station === this.props.name && PlaybackStore.playing ? <FaStop className="station-info-logo-stop-icon" /> : <FaPlay className={"station-info-logo-play-icon" + this.state.logoHoverState} />) : null*/}
                            <Image source={this.props.station.image} style={[styles.stationInfoLogoImage, styles.whiteBorder]} />
                        </View>
                        <Text style={[styles.stationInfoShowTitle, styles.bold]}>
                            {"Currently playing: "}
                            <Text style={styles.stationInfoShowTitle}>
                                {StationStore.shows[this.props.name].currentShow}
                            </Text>
                        </Text>
                        <Text style={styles.stationInfoDescription}>
                            {this.props.station.description}
                        </Text>
                    </ScrollView>
                </FadeInView>
            )
        }
    }
}