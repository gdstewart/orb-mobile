import * as Animatable from "react-native-animatable";
import { ActivityIndicator, Easing, Image, Linking, Share, StatusBar, TouchableOpacity, View } from "react-native";
import { Col, Grid, Row } from "react-native-easy-grid";
import { Container, Icon, StyleProvider, Text } from "native-base";
import { NavigationActions, createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import React, { Component } from "react";
import ActionSheet from "react-native-zhb-actionsheet";
import AppStore from "../../../stores/App";
import AwesomeAlert from "react-native-awesome-alert";
import NetInfo from "@react-native-community/netinfo";
import PlayerStore from "../../../stores/Player";
import ScheduleStore from "../../../stores/Schedule";
import Spinner from "react-native-loading-spinner-overlay";
import StationStore from "../../../stores/Station";
import TextTicker from "react-native-text-ticker";
import TrackPlayer from "react-native-track-player";
import { ScaledSheet, scale } from "react-native-size-matters";
import UserStore from "../../../stores/User";
import actionSheetStyles from "../../../theme/ActionSheetStyles";
import alertStyles from "../../../theme/AlertStyles";
import getCurrentShowName from "../../../utils/ShowFetcher";
import getTheme from "../../../theme/components";
import { observer } from "mobx-react";
import StationsData from "../../../data/StationsData";
import AppData from "../../../data/AppData";

@observer
class PlayerModal extends Component {
    static navigationOptions = {
        header: null
    }

    header = [{
        title: null,
        headerStyle: null,
        headerViewStyle: null
    }];

    options = [
        {
            title: "Description", action: () => {
                this._showDescription();
            }, textStyle: actionSheetStyles.actionSheetText, textViewStyle: actionSheetStyles.actionSheetTextView
        },
        {
            title: "Today's schedule", action: () => {
                this._viewSchedule();
            }, textStyle: actionSheetStyles.actionSheetText, textViewStyle: actionSheetStyles.actionSheetTextView
        },
        {
            title: "Website", action: () => {
                this._handleWebsiteUrl();
            }, textStyle: actionSheetStyles.actionSheetText, textViewStyle: actionSheetStyles.actionSheetTextView
        },
        {
            title: "Cancel", actionStyle: "cancel", action: () => {

            }, textStyle: actionSheetStyles.actionSheetCancelText, textViewStyle: actionSheetStyles.actionSheetTextView
        }
    ];

    icons = [
        { name: "information-variant", iconStyle: actionSheetStyles.actionSheetIcon },
        { name: "calendar-text", iconStyle: actionSheetStyles.actionSheetIcon },
        { name: "web", iconStyle: actionSheetStyles.actionSheetIcon },
        { name: "close", actionStyle: "cancel", iconStyle: actionSheetStyles.actionSheetCancelIcon }
    ];

    constructor(props) {
        super(props);
        this.actionSheetRef = React.createRef();
        this.alertRef = React.createRef();
        this.state = {
            navigation: props.navigation,
            params: props.navigation.state.params,
            header: this.header,
            options: this.options,
            icons: this.icons
        };
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
                <Text style={alertStyles.alertBodyText}>Make sure you are connected to the internet and try again.</Text>
            </View>,
            [{ text: "OK", onPress: () => { } }]
        )
        StationStore.structure.title = "Connection failed";
        await TrackPlayer.stop();
        PlayerStore.mediaPlayerClosed = true;
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

    _urlError = async () => {
        this.alertRef.alert(
            "Could not open URL",
            <View style={alertStyles.alertBodyTextView}>
                <Text style={alertStyles.alertBodyText}>Browser failed to open.</Text>
            </View>,
            [{ text: "OK", onPress: () => { } }]
        )
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
                        PlayerStore.stationLoaded = false;
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

    _skipToPreviousStation = async () => {
        if (!PlayerStore.networkError) {
            NetInfo.fetch().then(async (state) => {
                if (state.isConnected) {
                    PlayerStore.stationLoaded = false;
                    await TrackPlayer.reset();
                    if (PlayerStore.stationError) PlayerStore.stationError = false;
                    let target;
                    if (StationStore.structure.id === "NTS 2") {
                        target = "NTS 1";
                    } else {
                        let index = UserStore.activeStations.findIndex(obj => obj.value.name === StationStore.structure.id);
                        if (index === 0) target = UserStore.activeStations[UserStore.activeStations.length - 1].value.name;
                        else if (UserStore.activeStations[index - 1].value.name === "NTS 1") target = "NTS 2";
                        else target = UserStore.activeStations[index - 1].value.name;
                    }
                    await this._startPlayer(target);
                } else {
                    await this._networkError();
                }
            });
        }
    }

    _skipToNextStation = async () => {
        if (!PlayerStore.networkError) {
            NetInfo.fetch().then(async (state) => {
                if (state.isConnected) {
                    PlayerStore.stationLoaded = false;
                    await TrackPlayer.reset();
                    if (PlayerStore.stationError) PlayerStore.stationError = false;
                    let target;
                    if (StationStore.structure.id === "NTS 1") {
                        target = "NTS 2";
                    } else {
                        let index = UserStore.activeStations.findIndex(
                            obj => obj.value.name ===
                                (StationStore.structure.id === "NTS 2" ? "NTS 1" :
                                    StationStore.structure.id));
                        if (index === UserStore.activeStations.length - 1) target = UserStore.activeStations[0].value.name;
                        else if (StationStore.structure.id === "NTS 2") target = UserStore.activeStations[index + 1].value.name;
                        else target = UserStore.activeStations[index + 1].value.name;
                    }
                    await this._startPlayer(target);
                } else {
                    await this._networkError();
                }
            });
        }
    }

    _openStationOptions = async () => {
        this.actionSheetRef.show();
    }

    _saveCurrentShow = async () => {
        if (saved) {
            saved = false;
        } else {
            saved = true;
        }
    }

    _openShareOptions = async () => {
        if (!PlayerStore.stationError && !PlayerStore.networkError) {
            try {
                await Share.share({
                    message: StationStore.structure.title + " is playing right now on " + StationStore.structure.album + "!!!"
                }, {
                    dialogTitle: "Share this show"
                })
            } catch (error) {
                this.alertRef.alert(
                    "Could not share",
                    <View style={alertStyles.alertBodyTextView}>
                        <Text style={alertStyles.alertBodyText}>{error.message}</Text>
                    </View>,
                    [{ text: "OK", onPress: () => { } }]
                )
            }
        }
    }

    _showDescription() {
        this.alertRef.alert(
            "Description",
            <View style={alertStyles.alertBodyTextView}>
                <Text style={alertStyles.alertBodyText}>{StationsData[StationStore.structure.id].description}</Text>
            </View>,
            [{ text: "OK", onPress: () => { } }]
        )
    }

    _viewSchedule() {
        ScheduleStore.scheduleToView = StationStore.structure.id;
        AppStore.loading = true;
        setTimeout(() => {
            this.props.navigation.navigate("Schedules");
        }, 100);
    }

    _handleWebsiteUrl() {
        if (Linking.canOpenURL(StationStore.structure.album)) {
            Linking.openURL(StationStore.structure.album);
        } else {
            this._urlError();
        };
    };

    componentWillUnmount() {
        PlayerStore.networkError = false;
        PlayerStore.stationError = false;
    }

    render() {
        return (
            <StyleProvider style={getTheme()}>
                <Container style={{ backgroundColor: "transparent" }}>
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
                    <ActionSheet
                        ref={ref => this.actionSheetRef = ref}
                        header={this.state.header}
                        titles={this.state.options}
                        icons={this.state.icons}
                        separateHeight={Math.ceil(scale(1.5) / 2) * 2}
                        separateColor="#FFF"
                        backgroundColor="rgba(0, 0, 0, 0.6)"
                        containerStyle={actionSheetStyles.actionSheetContainer}
                        onClose={(obj) => { }}
                    />
                    <Spinner
                        visible={AppStore.loading}
                        overlayColor="rgba(0, 0, 0, 0.50)"
                    />
                    <StatusBar
                        barStyle="light-content"
                    />
                    <Grid style={styles.modal}>
                        <Row size={3} style={styles.headerRow}>
                            <Col size={1}>
                                <TouchableOpacity
                                    activeOpacity={0.6}
                                    style={styles.headerButton}
                                    onPress={() => this.state.navigation.dispatch(NavigationActions.back())}>
                                    <Icon name="chevron-down" type="MaterialCommunityIcons" style={styles.headerIcon} />
                                </TouchableOpacity>
                            </Col>
                            <Col size={1}>
                                <Image source={AppData.logo} style={styles.miniImage} />
                            </Col>
                            <Col size={1}>
                                <TouchableOpacity
                                    activeOpacity={0.6}
                                    style={styles.headerButton}
                                    onPress={this._openStationOptions}>
                                    <Icon name="dots-horizontal" type="MaterialCommunityIcons" style={styles.headerIcon} />
                                </TouchableOpacity>
                            </Col>
                        </Row>
                        <Row size={12} style={styles.row}>
                            <Image source={StationStore.structure.artwork} style={styles.image} />
                        </Row>
                        <Row size={6} style={styles.row}>
                            <Grid>
                                <Row size={1} style={styles.tickerRow}>
                                    <TickerField />
                                </Row>
                                <Row size={1} style={styles.tickerRow}>
                                    <StationField />
                                </Row>
                                <Row size={4} style={styles.playbackRow}>
                                    <Col size={1}>
                                        <View
                                            activeOpacity={0.6}
                                            style={styles.heartButton}
                                            onPress={this._saveCurrentShow}>

                                        </View>
                                    </Col>
                                    <Col size={1}>
                                        <TouchableOpacity
                                            activeOpacity={0.6}
                                            style={styles.previousButton}
                                            onPress={this._skipToPreviousStation}>
                                            <PreviousIcon />
                                        </TouchableOpacity>
                                    </Col>
                                    <Col size={1.5}>
                                        <TouchableOpacity
                                            activeOpacity={0.6}
                                            style={styles.startStopButton}
                                            onPress={this._togglePlayback}>
                                            <StartStopIcon />
                                        </TouchableOpacity>
                                    </Col>
                                    <Col size={1}>
                                        <TouchableOpacity
                                            activeOpacity={0.6}
                                            style={styles.nextButton}
                                            onPress={this._skipToNextStation}>
                                            <NextIcon />
                                        </TouchableOpacity>
                                    </Col>
                                    <Col size={1}>
                                        <TouchableOpacity
                                            activeOpacity={0.6}
                                            style={styles.shareButton}
                                            onPress={this._openShareOptions}>
                                            <ShareIcon />
                                        </TouchableOpacity>
                                    </Col>
                                </Row>
                            </Grid>
                        </Row>
                    </Grid>
                </Container>
            </StyleProvider>
        );
    }
};

@observer
class TickerField extends Component {
    render() {
        if (StationStore.structure.title != null && PlayerStore.stationLoaded || PlayerStore.stationError) {
            return <TextTicker
                style={styles.tickerText}
                duration={20000}
                loop
                bounce={false}
                repeatSpacer={PlayerStore.repeatSpacer}
                marqueeDelay={2000}
                easing={Easing.inOut(Easing.ease)}>
                {StationStore.structure.title}
            </TextTicker>;
        } else {
            return <Animatable.Text
                style={styles.tickerText}
                animation="fadeIn"
                iterationCount="infinite"
                direction="alternate">
                Loading...
            </Animatable.Text>;
        }
    }
}

@observer
class StationField extends Component {
    render() {
        if (StationStore.structure.id != null && PlayerStore.stationLoaded || PlayerStore.stationError) {
            return <Text style={styles.stationText}>{StationStore.structure.id}</Text>
        } else {
            return <Animatable.Text
                animation="fadeIn"
                iterationCount="infinite"
                direction="alternate">
                Loading...
            </Animatable.Text>;
        }
    }
}

@observer
class StartStopIcon extends Component {
    render() {
        if (PlayerStore.stationError)
            return <Icon name="play-circle-outline" type="MaterialCommunityIcons" style={styles.startStopIconInactive} />;
        else if (PlayerStore.playbackState === TrackPlayer.STATE_PLAYING)
            return <Icon name="stop-circle-outline" type="MaterialCommunityIcons" style={styles.startStopIcon} />;
        else if (PlayerStore.playbackState === TrackPlayer.STATE_BUFFERING || !PlayerStore.stationLoaded)
            return <ActivityIndicator animating={true} size="large" color="#fff" style={styles.activityIcon} />;
        else
            return <Icon name="play-circle-outline" type="MaterialCommunityIcons" style={styles.startStopIcon} />;
    }
}

@observer
class PreviousIcon extends Component {
    render() {
        if (!PlayerStore.stationLoaded && !PlayerStore.stationError || PlayerStore.networkError) return <Icon name="skip-previous" style={styles.previousIconInactive} />;
        else return <Icon name="skip-previous" type="MaterialCommunityIcons" style={styles.previousIcon} />;
    }
}

@observer
class NextIcon extends Component {
    render() {
        if (!PlayerStore.stationLoaded && !PlayerStore.stationError || PlayerStore.networkError) return <Icon name="skip-next" style={styles.nextIconInactive} />;
        else return <Icon name="skip-next" type="MaterialCommunityIcons" style={styles.nextIcon} />;
    }
}

@observer
class HeartIcon extends Component {
    render() {
        /*if (PlayerStore.stationError || PlayerStore.networkError)*/ return <Icon name="heart" type="MaterialCommunityIcons" style={styles.heartIconInactive} />
        /*else return <Icon name="heart" style={styles.heartIcon} />*/
    }
}

@observer
class ShareIcon extends Component {
    render() {
        if (PlayerStore.stationError || PlayerStore.networkError) return <Icon name="share" type="MaterialCommunityIcons" style={styles.shareIconInactive} />;
        else return <Icon name="share" type="MaterialCommunityIcons" style={styles.shareIcon} />;
    }
}

const styles = ScaledSheet.create({
    modal: {
        backgroundColor: "#000",
        borderTopLeftRadius: 50,
        borderTopRightRadius: 50,
        borderColor: "#FFF",
        borderWidth: Math.ceil(scale(1.5) / 2) * 2,
        borderBottomWidth: 0
    },
    row: {
        alignItems: "center",
        justifyContent: "center"
    },
    headerRow: {
        alignItems: "center",
        justifyContent: "center",
        top: "20@vs"
    },
    playbackRow: {
        alignItems: "center",
        justifyContent: "center",
        bottom: "15@vs"
    },
    headerButton: {
        alignSelf: "center"
    },
    headerIcon: {
        color: "#fff",
        fontSize: "42@s"
    },
    image: {
        width: AppStore.screen.width * 0.8,
        height: AppStore.screen.width * 0.8,
        borderWidth: Math.ceil(scale(1.5) / 2) * 2,
        borderColor: "#FFF"
    },
    tickerRow: {
        alignItems: "center",
        justifyContent: "center",
        marginLeft: "40@s",
        marginRight: "40@s",
        bottom: "5@vs"
    },
    tickerText: {
        alignSelf: "center",
        fontFamily: "Proxima_Nova",
        fontSize: "22@s",
        fontWeight: "bold",
        color: "#fff"
    },
    stationText: {
        alignSelf: "center",
        fontSize: "16@s"
    },
    shareButton: {
        alignSelf: "flex-start"
    },
    shareIcon: {
        color: "#fff",
        fontSize: "42@s"
    },
    shareIconInactive: {
        color: "#FFF",
        fontSize: "42@s"
    },
    startStopButton: {
        alignSelf: "center"
    },
    startStopIcon: {
        color: "#fff",
        fontSize: "84@s"
    },
    startStopIconInactive: {
        color: "#FFF",
        fontSize: "84@s"
    },
    previousButton: {
        alignSelf: "flex-end"
    },
    previousIcon: {
        color: "#fff",
        fontSize: "42@s"
    },
    previousIconInactive: {
        color: "#FFF",
        fontSize: "42@s"
    },
    nextButton: {
        alignSelf: "flex-start"
    },
    nextIcon: {
        color: "#fff",
        fontSize: "42@s"
    },
    nextIconInactive: {
        color: "#FFF",
        fontSize: "42@s"
    },
    activityIcon: {
        alignSelf: "center",
        scaleX: "2.3@s",
        scaleY: "2.3@s"
    },
    heartButton: {
        alignSelf: "flex-end"
    },
    heartIcon: {
        color: "#fff",
        fontSize: "42@s"
    },
    heartIconSaved: {
        color: "#777",
        fontSize: "42@s"
    },
    heartIconInactive: {
        color: "#FFF",
        fontSize: "42@s"
    },
    miniImage: {
        height: "52@s",
        width: "52@s",
        alignSelf: "center"
    }
});

const Navigator = createStackNavigator({
    Player: {
        screen: PlayerModal
    },
},
    {
        transparentCard: true,
    }
);

export default createAppContainer(Navigator);