import { observable } from "mobx";

class Playback {
    @observable playbackState;
    @observable stationLoaded = false;
    @observable repeatSpacer;
    structure = observable({
        id: undefined,
        url: undefined,
        title: undefined,
        artist: undefined,
        artwork: undefined,
        album: undefined,
        description: undefined
    });
}

export default new Playback();