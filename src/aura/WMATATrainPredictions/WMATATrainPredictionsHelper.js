({    
    refreshTrainData : function(component, event, helper) {
        let action = component.get("c.getWMATAPayload");
        action.setParams({
            metroAPIKey: component.get("v.metroAPIKey"),
            url: "https://api.wmata.com/StationPrediction.svc/json/GetPrediction/All"
        });
        action.setCallback(this, function(response) {
            if (response.getState() === "SUCCESS") {
                let returnValue = JSON.parse(response.getReturnValue()).Trains;
                if (returnValue != null) {
                    component.set("v.allTrains", returnValue);
                    component.set("v.stations", helper.buildOptionsList(returnValue));
                    component.set("v.selectedStation", "None");
                    component.set("v.trainsVisibility", false);
                    component.set("v.incidentsVisibility", false);
                    component.set("v.incidentsButtonVisibility", false);
                }
            }
        });
        $A.enqueueAction(action);
    },
    
    refreshIncidentsData : function(component, event, helper) {
        var action = component.get("c.getWMATAPayload");
        action.setParams({
            metroAPIKey: component.get("v.metroAPIKey"),
            url: "https://api.wmata.com/Incidents.svc/json/Incidents"
        });
        action.setCallback(this, function(response) {
            if (response.getState() === "SUCCESS") {
                var returnValue = JSON.parse(response.getReturnValue()).Incidents;
                for (let incident = 0; incident < returnValue.length; incident++) {
                    let lineString = returnValue[incident].LinesAffected;
                    returnValue[incident].lines = [];
                    if (lineString.includes("RD")) {
                        let lineObj = new Object();
                        lineObj.lineName = "Red";
                        lineObj.lineColor = "#e51736";                       
                        returnValue[incident].lines.push(lineObj);
                    }
                    if (lineString.includes("OR")) {
                        let lineObj = new Object();
                        lineObj.lineName = "Orange";
                        lineObj.lineColor = "#f7931d";                       
                        returnValue[incident].lines.push(lineObj);
                    }
                    if (lineString.includes("YL")) {
                        let lineObj = new Object();
                        lineObj.lineName = "Yellow";
                        lineObj.lineColor = "#fdd107";                       
                        returnValue[incident].lines.push(lineObj);
                    }
                    if (lineString.includes("GR")) {
                        let lineObj = new Object();
                        lineObj.lineName = "Green";
                        lineObj.lineColor = "#02a84e";                       
                        returnValue[incident].lines.push(lineObj);
                    }
                    if (lineString.includes("SV")) {
                        let lineObj = new Object();
                        lineObj.lineName = "Silver";
                        lineObj.lineColor = "#9fa3a1";                       
                        returnValue[incident].lines.push(lineObj);
                    }
                    if (lineString.includes("BL")) {
                        let lineObj = new Object();
                        lineObj.lineName = "Blue";
                        lineObj.lineColor = "#0077c0";                       
                        returnValue[incident].lines.push(lineObj);
                    }
                }
                component.set("v.metroIncidents", returnValue);
            }
        });
        $A.enqueueAction(action);        
    },
    
    buildOptionsList : function(trains) {
        let stations = [];
        for (let train = 0; train < trains.length; train++) {
            if (trains[train].LocationName != null && trains[train].LocationCode != null && !stations.some(s => s.LocationName === trains[train].LocationName)) {
                let station = new Object();
                station.LocationName = trains[train].LocationName;
                station.LocationCode = trains[train].LocationCode;
                stations.push(station);
            }
        }
        stations.sort((a,b) => (a.LocationName > b.LocationName) ? 1 : ((a.LocationName < b.LocationName) ? -1 : 0));
        return stations;
    },
    
    getTrainsFromSelection : function(stationCode, component, event, helper) {
        let allTrains = component.get("v.allTrains");
        let selectedTrains = [];
        for (let train = 0; train < allTrains.length; train++) {
            let min = allTrains[train].Min;
            if (allTrains[train].LocationCode === stationCode && !(min === "---" || min == null || min == ""))
                selectedTrains.push(allTrains[train]);
        }
        selectedTrains.sort((a,b) => (a.Min == "BRD") ? 1 : ((a.Min == "ARR") ? 1 :
                            (Number(a.Min) > Number(b.Min)) ? 1 : (Number(a.Min) < Number(b.Min)) ? -1 : 0));
        return selectedTrains;        
    }
})