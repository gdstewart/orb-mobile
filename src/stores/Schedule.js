import { observable } from "mobx";

class Schedule {
    @observable currentStation = "";
    @observable currentDayIndex = 0;
    @observable currentSchedule = null;
    @observable weekArray = [];
    @observable scheduleToView;
}

export default new Schedule();