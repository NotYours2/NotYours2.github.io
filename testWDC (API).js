(function () {
    var myConnector = tableau.makeConnector();




myConnector.getSchema = function (schemaCallback) {
    var cols = [{
        id: "year",
        dataType: tableau.dataTypeEnum.string
    }, {
        id: "period",
        alias: "period",
        dataType: tableau.dataTypeEnum.string
    }, {
        id: "periodName",
        alias: "Month",
        dataType: tableau.dataTypeEnum.string
    }, {
        id: "latest",
        alias: "latest",
        dataType: tableau.dataTypeEnum.string
    }, {
        id: "value",
        dataType: tableau.dataTypeEnum.string
    }
];

    var tableSchema = {
        id: "BLS",
        alias: "BLS Series",
        columns: cols
    };

    schemaCallback([tableSchema]);
};



myConnector.getData = function(table, doneCallback) {
    $.getJSON("https://api.bls.gov/publicAPI/v2/timeseries/data/LAUCN040010000000005?latest=true&api_key=1639a51149b14e1f8b9bc2aab8635b78", function(resp) {
        var feat = resp.Results.series[0].data,
            tableData = [];
	

        // Iterate over the JSON object
        for (var i = 0, len = feat.length; i < len; i++) {
            tableData.push({
                "year": feat[i].year,
                "period": feat[i].period,
                "periodName": feat[i].periodName,
		"latest": feat[i].latest,
                "value": feat[i].value
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
        tableau.connectionName = "BLS Feed";
        tableau.submit();
    });
});
