import { observable } from "mobx";
import { Dimensions } from "react-native";

class App {
    @observable loading = false;
    @observable stationsLoaded = false;
    @observable mediaPlayerClosed = true;
    @observable stationError = false;
    @observable networkError = false;
    screen = {
        width: Dimensions.get("window").width,
        height: Dimensions.get("window").height
    };
}

export default new App();