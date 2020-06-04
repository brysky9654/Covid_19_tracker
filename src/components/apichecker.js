import React, { Component } from 'react';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";

am4core.useTheme(am4themes_animated);

class ApiChecker extends Component {
    state = {
        data: {},
        history: {},
        history2: {},
        confirmed: 0,
        deaths: 0,
        recovered: 0
    }

    componentDidMount() {
        fetch('https://coronavirus-tracker-api.herokuapp.com/all')
            .then(res => res.json())
            .then(result => {
                let res = result["latest"]
                this.setState({
                    data: result,
                    history: result["confirmed"]["locations"][0]["history"],
                    history2: result["recovered"]["locations"][0]["history"],
                    confirmed: res["confirmed"],
                    deaths: res["deaths"],
                    recovered: res["recovered"]
                });
                console.log('in fetch', this.state);
                am4core.useTheme(am4themes_animated);

                let chart = am4core.create("chartdiv", am4charts.XYChart);

                chart.paddingRight = 20;






                let histories = this.state.history;
                console.log("historyies", histories);

                let chart_data = [];
                var i = 0;

                for (var dates in histories) {
                    chart_data.push({ date: new Date(dates), name: "names" + i, value: histories[dates], linecolor: "green" });
                    i = i + 1;
                }
                console.log('history data: ', chart_data);


                chart.data = chart_data;



                let dateAxis = chart.xAxes.push(new am4charts.DateAxis());

                dateAxis.renderer.minGridDistance = 50;
                let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());

                valueAxis.renderer.minWidth = 35;

                let series = chart.series.push(new am4charts.LineSeries());
                series.dataFields.dateX = "date";
                series.dataFields.valueY = "value";

                series.tooltipText = "{valueY.value} cases";
                chart.cursor = new am4charts.XYCursor();

                series.strokeWidth = 2;
                series.fill = "red";
                chart.colors = "red";

                chart.stroke = am4core.color("green");
                series.stroke = am4core.color("red");

                series.propertyFields.fill = "color";

                series.propertyFields.stroke = "lineColor";
                series.propertyFields.fill = "lineColor";


                // var series2 = chart.series.push(new am4charts.LineSeries());
                // series2.dataFields.valueY = "value2";
                // series2.dataFields.dateX = "date";
                // series2.strokeWidth = 2;
                // series2.strokeDasharray = "3,4";
                // series2.stroke = series.stroke;


                this.chart = chart;
            })
    }
    componentWillUnmount() {
        if (this.chart) {
            this.chart.dispose();
        }
    }

    render() {
        let results = this.state;
        console.log(results.data)
        console.log(results.history)

        return (
            <div>
                <h1>Hina</h1>
                <h1>Confirmed : {results.confirmed}</h1>
                <h1>Deaths : {results.deaths}</h1>
                <h1>Recovered : {results.recovered}</h1>

                {
                    (Object.keys(results.data).length > 1) ?
                        <div><p>Confirmed Last Updated : {results.data.confirmed.last_updated}</p>
                            <p>Confirmed Last Updated : {results.data.deaths.last_updated}</p>
                            <p>Confirmed Last Updated : {results.data.recovered.last_updated}</p>
                        </div>
                        : null
                }

                <div id="chartdiv" style={{ width: "100%", height: "500px" }}></div>


            </div>
        );
    }

}

export default ApiChecker;