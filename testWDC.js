(function () {
    var myConnector = tableau.makeConnector();

myConnector.getSchema = function (schemaCallback) {
    var cols = [{
        id: "id",
        dataType: tableau.dataTypeEnum.string
    }, {
        id: "mag",
        alias: "magnitude",
        dataType: tableau.dataTypeEnum.float
    }, {
        id: "title",
        alias: "title",
        dataType: tableau.dataTypeEnum.string
    }, {
        id: "foot",
        alias: "foot",
        dataType: tableau.dataTypeEnum.string
    }, {
        id: "location",
        dataType: tableau.dataTypeEnum.float
    }];

    var tableSchema = {
        id: "earthquakeFeed",
        alias: "Earthquakes with magnitude greater than 4.5 in the last seven days",
        columns: cols
    };

    schemaCallback([tableSchema]);
};



myConnector.getData = function(table, doneCallback) {
    $.getJSON("https://api.bls.gov/publicAPI/v1/timeseries/data/CUSR0000SA0?latest=true", function(resp) {
        var feat = resp.features,
            tableData = [];

        // Iterate over the JSON object
        for (var i = 0, len = feat.length; i < len; i++) {
            tableData.push({
                "id": feat[i].id,
                "mag": feat[i].properties.mag,
                "title": feat[i].properties.title,
		"foot": feat[i].properties.foot,
                "location": feat[i].geometry
            });
        }

        table.appendRows(tableData);
        doneCallback();
    });
};



    tableau.registerConnector(myConnector);
})();
$(document).ready(function () {
    $("#submitButton").click(function () {
        tableau.connectionName = "USGS Earthcake Feed";
        tableau.submit();
    });
});
