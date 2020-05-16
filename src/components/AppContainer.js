import React from "react";
import { TouchableOpacity, StyleSheet, StatusBar } from "react-native";
import { Footer, FooterTab, Button, Icon, StyleProvider, Text, View } from "native-base";
import { createAppContainer } from "react-navigation";
import { createStackNavigator, TransitionPresets } from "react-navigation-stack";
import { createMaterialTopTabNavigator } from "react-navigation-tabs";
import getTheme from "../theme/components";
import StationsView from "./views/stations/StationsView";
/*
import SchedulesView from "./views/schedules/SchedulesView";
import SavedView from "./views/saved/SavedView";
import MiscView from "./views/misc/MiscView";
import PlayerModal from "./views/player/PlayerModal";
*/
import MiniPlayer from "./views/player/MiniPlayer";
import styles from "../theme/styles";

const TabNavigator = createMaterialTopTabNavigator({
    Stations: StationsView,
    /*
    Schedules: SchedulesView,
    Saved: SavedView,
    Misc: MiscView
    */
},
    {
        swipeEnabled: false,
        tabBarPosition: "bottom",
        tabBarComponent: props => {
            return (
                <StyleProvider style={getTheme()}>
                    <View>
                        <MiniPlayer />
                        <Footer>
                            <FooterTab>
                                <Button active={props.navigation.state.index === 0}>
                                    <TouchableOpacity
                                        activeOpacity={0.6}
                                        style={styles.tabButton}
                                        onPress={() => props.navigation.navigate("Stations")}>
                                        <Icon name="access-point" type="MaterialCommunityIcons" />
                                        <Text>Stations</Text>
                                    </TouchableOpacity>
                                </Button>
                                {/*
                                <Button active={props.navigation.state.index === 1}>
                                    <TouchableOpacity
                                            activeOpacity={0.6} 
                                            style={styles.tabButton}
                                            onPress={() => props.navigation.navigate("Schedules")}>
                                        <Icon name="calendar-text" type="MaterialCommunityIcons" />
                                        <Text>Schedules</Text>
                                    </TouchableOpacity>
                                </Button> 
                                <Button active={props.navigation.state.index === 3}>
                                    <TouchableOpacity
                                            activeOpacity={0.6} 
                                            style={styles.tabButton}
                                            onPress={() => props.navigation.navigate("Misc")}>
                                        <Icon name="dots-horizontal" type="MaterialCommunityIcons" />
                                        <Text>Misc</Text>
                                    </TouchableOpacity>
                                </Button>
                                */}
                            </FooterTab>
                        </Footer>
                        <StatusBar
                            barStyle="light-content"
                            backgroundColor="black"
                        />
                    </View>
                </StyleProvider>
            )
        }

    }
);

/*
    <Button active={props.navigation.state.index === 2}>
        <TouchableOpacity
                activeOpacity={0.6} 
                style={styles.tabButton}
                onPress={() => props.navigation.navigate("Saved")}>
            <Icon name = "heart" />
            <Text>Saved</Text>
        </TouchableOpacity>
    </Button>
*/

const MainContainer = createAppContainer(TabNavigator);

const Navigator = createStackNavigator(
    {
        Main: {
            screen: MainContainer,
        },
        /*
        Modal: {
            screen: PlayerModal,
        },
        */
    },
    {
        mode: "modal",
        headerMode: "none",
        /*transparentCard: true,*/
        defaultNavigationOptions: {
            ...TransitionPresets.ModalSlideFromBottomIOS,
            cardStyle: {
                backgroundColor: "transparent",
                opacity: 1
            },
        },
    }
);

export default AppContainer = createAppContainer(Navigator);