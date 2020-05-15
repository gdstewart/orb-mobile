import TrackPlayer from "react-native-track-player";
import PlaybackStore from "./src/stores/Playback";

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
        PlaybackStore.mediaPlayerClosed = true;
    })

};