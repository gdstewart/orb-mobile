import TrackPlayer from "react-native-track-player";
import PlaybackStore from "./src/stores/Playback";
import AppStore from "./src/stores/App";

module.exports = async function () {

    TrackPlayer.addEventListener("remote-play", () => {
        TrackPlayer.skip(PlaybackStore.structure.id);
        TrackPlayer.play();
    })

    TrackPlayer.addEventListener("remote-pause", () => {
        TrackPlayer.pause();
    })

    TrackPlayer.addEventListener("remote-stop", () => {
        TrackPlayer.stop();
        AppStore.mediaPlayerClosed = true;
    })

};