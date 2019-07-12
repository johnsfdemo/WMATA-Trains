({
    onInit : function(component, event, helper) {
        helper.refreshTrainData(component, event, helper);
        helper.refreshIncidentsData(component, event, helper);
    },
    
    handleStationSelect : function (component, event, helper) {
        component.set("v.trainsVisibility", false);
        component.set("v.incidentsVisibility", false);
    },
    
    handleShowButton : function(component, event, helper) {
        let stationCode = component.get("v.selectedStation");
        if (stationCode === 'None')
            component.find("notifLib").showToast({
                variant: "error",
                message: "Please select a departure station.",
                mode: "dismissable"
            });
        else {
            component.set("v.trainList", helper.getTrainsFromSelection(stationCode, component, event, helper));
            component.set("v.trainsVisibility", true);
            component.set("v.incidentsButtonVisibility", true);
        }       
    },
    
    handleIncidentsButton : function(component, event, helper) {
        component.set("v.incidentsVisibility", !component.get("v.incidentsVisibility"));
    },
    
    handleRefreshButton : function(component, event, helper) {
        helper.refreshTrainData(component, event, helper);
        component.find("notifLib").showToast({
            variant: "success",
            message: "Train data has been refreshed with the latest information from Metrorail.",
            mode: "dismissable"
        });        
    }
})