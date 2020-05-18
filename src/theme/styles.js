import { ScaledSheet, scale, verticalScale } from "react-native-size-matters";
import AppStore from "../stores/App";

export default styles = ScaledSheet.create({
    whiteBorder: {
        borderColor: "#FFF",
        borderWidth: 2
    },
    greyBorder: {
        borderColor: "#666",
        borderWidth: 2
    },
    bold: {
        fontWeight: "bold"
    },
    disabled: {
        opacity: 0.4
    },
    headerButton: {
        alignSelf: "center",
        marginRight: 10
    },
    headerIcon: {
        color: "#FFF",
        fontSize: 40
    },
    section: {
        color: "#FFF",
        display: "flex",
        justifyContent: "flex-start",
        margin: "5@s",
        marginTop: "5@s",
        marginBottom: "5@s",
        padding: 0
    },
    row: {
        flexDirection: "row"
    },
    stationsList: {
        margin: "10@s",
        marginBottom: 0,
        marginRight: 0,
        padding: 0
    },
    stationsListItem: {
        position: "relative",
        display: "flex",
        flexDirection: "row",
        marginBottom: "10@s",
        marginRight: "10@s",
        padding: "10@s",
    },
    stationsListItemAlt: {
        position: "relative",
        display: "flex",
        flexDirection: "row",
        marginBottom: "10@s",
        marginRight: "10@s",
        padding: "10@s",
        height: "130@vs"
    },
    stationsListItemLogo: {
        height: "80@vs",
        width: "80@vs"
    },
    stationsListItemLogoImage: {
        height: "80@vs",
        width: "80@vs"
    },
    stationsListItemLogoStopIcon: {
        zIndex: 1,
        opacity: 1,
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        position: "absolute",
        height: "80@vs",
        width: "80@vs",
        fontSize: "80@vs",
        color: "#FFF"
    },
    stationsListItemBody: {
        minWidth: 0,
        marginLeft: "10@s",
        display: "flex",
        flexDirection: "column"
    },
    stationsListItemTime: {
        fontFamily: "Authentic_Sans",
        fontSize: "11@s",
        color: "#FFF"
    },
    stationsListItemShowTitle: {
        fontFamily: "Authentic_Sans",
        fontSize: "16@s",
        color: "#FFF",
        fontWeight: "bold",
        width: AppStore.screen.width - AppStore.screen.width / 2.8
    },
    stationsListItemStationName: {
        marginTop: "auto",
        fontFamily: "Authentic_Sans",
        fontSize: "13@s",
        color: "#FFF"
    },
    stationInfo: {
        padding: "10@s"
    },
    stationInfoLogo: {
        alignSelf: "center",
        marginTop: "10@s",
        marginBottom: "10@s",
        height: "200@vs",
        width: "200@vs"
    },
    stationInfoLogoImage: {
        height: "200@vs",
        width: "200@vs"
    },
    stationInfoShowTitle: {
        marginTop: "10@s",
        fontFamily: "Authentic_Sans",
        fontSize: "17@s",
        color: "#FFF"
    },
    stationInfoDescription: {
        marginTop: "10@s",
        fontFamily: "Authentic_Sans",
        fontSize: "14@s",
        color: "#FFF",
        paddingBottom: "30@s"
    },
    tabButton: {
        alignItems: "center",
        justifyContent: "center"
    },
    overlay: {
        position: "absolute",
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: "#FFF"
    },
    scheduleListItemDateText: {
        justifyContent: "center",
        alignItems: "flex-end"
    },
    scheduleListItemMiniIcon: {
        color: "#fff",
        fontSize: "26@s"
    },
    scheduleListItemStyle: {
        height: Math.ceil(scale(54) / 2) * 2,
        backgroundColor: "#000",
        borderWidth: Math.ceil(scale(1.5) / 2) * 2,
        borderBottomWidth: 0,
        borderColor: "#333333",
        flexDirection: "row"
    },
    scheduleListItemStyleBottom: {
        height: Math.ceil(scale(54) / 2) * 2,
        backgroundColor: "#000",
        borderWidth: Math.ceil(scale(1.5) / 2) * 2,
        borderColor: "#333333",
        flexDirection: "row"
    },
    aboutInfo: {
        padding: "10@s"
    },
    aboutInfoHeader: {
        fontSize: "17@s",
        marginBottom: "10@s",
        fontWeight: "bold"
    },
    aboutInfoBlurb: {
        fontSize: "14@s",
        marginBottom: "5@s"
    },
    aboutInfoImage: {
        marginTop: "10@s",
        flex: 1,
        aspectRatio: 1.44,
        height: undefined,
        width: "100%",
        resizeMode: "contain"
    },
    aboutInfoImageCredits: {
        fontSize: "8@s"
    },
    actionSheetContainer: {
        width: AppStore.screen.width,
        borderWidth: Math.ceil(scale(1.5) / 2) * 2,
        borderColor: "#FFF"
    },
    actionSheetHeader: {
        color: "#fff",
        fontFamily: "Authentic_Sans",
        fontSize: "19@s",
        fontWeight: "bold"
    },
    actionSheetText: {
        color: "#fff",
        fontFamily: "Authentic_Sans",
        fontSize: "16@s"
    },
    actionSheetCancelText: {
        color: "#FFF",
        fontFamily: "Authentic_Sans",
        fontSize: "16@s"
    },
    actionSheetHeaderView: {
        flexDirection: "row",
        justifyContent: "space-between",
        backgroundColor: "#000",
        paddingLeft: "15@s",
        paddingRight: "15@s"
    },
    actionSheetTextView: {
        flexDirection: "row",
        backgroundColor: "#000"
    },
    actionSheetIcon: {
        width: AppStore.screen.width / 8,
        color: "#fff",
        fontSize: "26@s",
        textAlign: "center"
    },
    actionSheetCancelIcon: {
        width: AppStore.screen.width / 8,
        color: "#FFF",
        fontSize: "26@s",
        textAlign: "center"
    },
    alertContainer: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        justifyContent: "center",
        alignItems: "center"
    },
    alertView: {
        backgroundColor: "#000",
        width: AppStore.screen.width * 0.75,
        borderWidth: Math.ceil(scale(1.5) / 2) * 2,
        borderColor: "#FFF",
        borderRadius: 0,
        paddingLeft: "15@s",
        paddingRight: "15@s"
    },
    alertTitleText: {
        color: "#fff",
        fontFamily: "Authentic_Sans",
        fontSize: "19@s"
    },
    alertBodyText: {
        color: "#fff",
        fontFamily: "Authentic_Sans",
        fontSize: "15@s"
    },
    alertButtonText: {
        color: "#fff",
        fontFamily: "Authentic_Sans",
        fontSize: "16@s"
    },
    alertButtonContainer: {
        borderTopWidth: 0
    },
    alertBodyTextView: {
        flexDirection: "row",
        backgroundColor: "#000"
    },
    alertIcon: {
        color: "#fff"
    },
    dropdownButtonLeft: {
        height: "60@vs",
        width: AppStore.screen.width / 2 - scale(14),
        alignItems: "center",
        justifyContent: "space-between",
        flexDirection: "row",
        backgroundColor: "#000",
        padding: "10@s",
        borderColor: "#FFF",
        borderWidth: Math.ceil(scale(1.5) / 2) * 2
    },
    dropdownButtonRight: {
        height: "60@vs",
        width: AppStore.screen.width / 2 - scale(14),
        alignItems: "center",
        justifyContent: "space-between",
        flexDirection: "row",
        backgroundColor: "#000",
        padding: "10@s",
        borderColor: "#FFF",
        borderWidth: Math.ceil(scale(1.5) / 2) * 2
    },
    dropdownButtonText: {
        fontFamily: "Authentic_Sans",
        color: "#fff",
        width: "120@s"
    },
    dropdownButtonIcon: {
        fontFamily: "Authentic_Sans",
        fontSize: "19@s",
        color: "#fff"
    },
    dropdownListItem: {
        height: "60@vs",
        backgroundColor: "#fff",
        flex: 1,
        flexDirection: "row"
    },
    dropdownListItemBlank: {
        flex: 1,
        backgroundColor: "#000",
        borderColor: "#FFF",
        borderBottomWidth: Math.ceil(scale(1.5) / 2) * 2
    },
    dropdownListItemIcon: {
        flex: 1,
        textAlign: "center",
        textAlignVertical: "center",
        fontFamily: "Authentic_Sans",
        fontSize: "26@s",
        color: "#fff",
        backgroundColor: "#000",
        borderColor: "#FFF"
    },
    dropdownListItemContent: {
        flex: 5,
        alignItems: "center",
        flexDirection: "row",
        backgroundColor: "#000",
        borderBottomColor: "#FFF",
        borderBottomWidth: Math.ceil(scale(1.5) / 2) * 2
    },
    dropdownListItemText: {
        fontSize: "14@s",
        flex: 4,
        fontFamily: "Authentic_Sans",
        color: "#fff"
    },
    dropdownListItemSettingButton: {
        flex: 1,
        justifyContent: "space-evenly",
        flexDirection: "row",
        padding: "10@s"
    },
    dropdownListItemLinkButton: {
        flex: 1,
        justifyContent: "flex-end",
        flexDirection: "row",
        padding: "10@s"
    },
    dropdownListItemButtonText: {
        fontFamily: "Authentic_Sans",
        color: "#FFF"
    },
    dropdownListItemButtonIcon: {
        fontFamily: "Authentic_Sans",
        fontSize: "19@s",
        color: "#FFF"
    },
    dropddownModalOption: {
        backgroundColor: "#000",
        borderColor: "#FFF",
        borderWidth: Math.ceil(scale(1.5) / 2) * 2,
        borderBottomWidth: 0,
        height: Math.ceil(verticalScale(58) / 2) * 2,
        justifyContent: "center"
    },
    dropddownModalOptionTop: {
        backgroundColor: "#000",
        borderColor: "#FFF",
        borderWidth: Math.ceil(scale(1.5) / 2) * 2,
        borderBottomWidth: 0,
        borderTopWidth: 0,
        height: Math.ceil(verticalScale(58) / 2) * 2,
        justifyContent: "center"
    },
    dropddownModalOptionText: {
        color: "#fff",
        textAlign: "center"
    },
    dropddownModalOptionTextHighlight: {
        color: "#777",
        textAlign: "center"
    },
    dropddownModalArrowTopView: {
        backgroundColor: "transparent",
        borderColor: "#FFF",
        borderBottomWidth: Math.ceil(scale(1.5) / 2) * 2,
        alignItems: "center"
    },
    dropddownModalArrowBottomView: {
        backgroundColor: "transparent",
        borderColor: "#FFF",
        borderTopWidth: Math.ceil(scale(1.5) / 2) * 2,
        alignItems: "center"
    },
    dropddownModalArrowIcon: {
        backgroundColor: "transparent",
        color: "#fff",
        fontSize: "36@s"
    },
    miniPlayer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        height: "70@vs",
        backgroundColor: "#000",
        borderColor: "#FFF",
        borderTopWidth: Math.ceil(scale(1.5) / 2) * 2
    },
    miniPlayerImage: {
        height: "50@s",
        width: "50@s",
        alignSelf: "center"
    },
    miniPlayerTickerText: {
        fontFamily: "Authentic_Sans",
        fontSize: "14@s",
        fontWeight: "bold",
        color: "#fff"
    },
    miniPlayerLoadingText: {
        fontFamily: "Authentic_Sans",
        fontSize: "22@s",
        fontWeight: "bold",
        color: "#fff"
    },
    miniPlayerStationText: {
        fontSize: "12@s"
    },
    miniPlayerStartStopButton: {
        alignSelf: "center"
    },
    miniPlayerStartStopIcon: {
        color: "#fff",
        fontSize: "52@s",
        top: -1
    },
    miniPlayerActivityIcon: {
        alignSelf: "center",
        scaleX: "1.45@s",
        scaleY: "1.45@s"
    }
});