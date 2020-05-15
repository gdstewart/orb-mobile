import { AppRegistry, YellowBox } from "react-native";
import App from "./App";
import { name as appName } from "./app.json";
import TrackPlayer from "react-native-track-player";
import "mobx-react-lite/batchingForReactNative";

AppRegistry.registerComponent(appName, () => App);
TrackPlayer.registerPlaybackService(() => require("./service"));
YellowBox.ignoreWarnings(["ListView is deprecated"]);