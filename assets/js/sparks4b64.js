Highcharts.SparkLine = function (a, b, c) {
    var hasRenderToArg = typeof a === 'string' || a.nodeName,
        options = arguments[hasRenderToArg ? 1 : 0],
        defaultOptions = {
            chart: {
                renderTo: (options.chart && options.chart.renderTo) || this,
                backgroundColor: 'transparent',
                borderWidth: 0,
                type: 'area',
                margin: [0, 0, 0, 0],
                height: 30,
                style: {
                    overflow: 'visible'
                },
                skipClone: true
            },
            title: {
                text: ''
            },
            credits: {
                enabled: false
            },
            xAxis: {
                labels: {
                    enabled: false
                },
                title: {
                    text: null
                },
                startOnTick: false,
                endOnTick: false,
                tickPositions: []
            },
            yAxis: {
                endOnTick: false,
                startOnTick: false,
 
                labels: {
                    enabled: false
                },
                title: {
                    text: null
                },
                gridLineColor: null
            },
            legend: {
                enabled: false
            },
            tooltip: {
                enabled: true,
                formatter: function() {
                    return this.y.toFixed(2);
                }
            },
            plotOptions: {   
                series: {
                    color: '#FFA500',
                    animation: false,
                    lineWidth: 1,
                    shadow: false,
                    states: {
                        hover: {
                            lineWidth: 1
                        }
                    },
                    marker: {
                        enabled: false,
                        radius: 1,
                        states: {
                            hover: {
                                radius: 2
                            }
                        }
                    },
                    fillOpacity: 0
                },
                column: {
                    negativeColor: '#000000',
                    borderColor: 'silver'
                }
            }
        };
        options = Highcharts.merge(defaultOptions, options);
 
        return hasRenderToArg ?
            new Highcharts.Chart(a, options, c) :
            new Highcharts.Chart(options, b);
    };   
    
    var largeChart = null;
    var largeChartData = [];    

    var makeData = function(data, charttype) {

        if (charttype == 'area') return data;
     
        var result = [];
     
        // 60 minute chunks..
        var tmp = [];
        var lasthour = -1;
        for (var i = 0, len = data.length; i < len; i++) {
            var date = new Date(data[i][0]);

            if (date.getHours() != lasthour) {
                lasthour = date.getHours();
                if (tmp.length) {
                    var max = Math.max.apply(Math,tmp.map(function(o){return o[1];}));
                    var min = Math.min.apply(Math,tmp.map(function(o){return o[1];}));
                    
                    var item = {
                        x: tmp[0][0],
                        open: tmp[0][1],
                        high: max,
                        low: min,
                        close: tmp[tmp.length-1][1]
                    };

                    result.push(item);
                }
                tmp = [];
            }
            tmp.push(data[i]);
        }

        return result;
    }
   
    var chartStartFromCode = function(dateRange) {
        var startTime = new Date().getTime() - (1000 * 60 * 60 * 24 * 365 * 5);
   
        if (dateRange == '1H') { startTime = new Date().getTime() - (1000 * 60 * 60); }
        if (dateRange == '4H') { startTime = new Date().getTime() - (1000 * 60 * 60 * 4); } 
        if (dateRange == '1D') { startTime = new Date().getTime() - (1000 * 60 * 60 * 24); }
        if (dateRange == '3D') { startTime = new Date().getTime() - (1000 * 60 * 60 * 24 * 3); }
        if (dateRange == '7D') { startTime = new Date().getTime() - (1000 * 60 * 60 * 24 * 7); }
        if (dateRange == '1M') { startTime = new Date().getTime() - (1000 * 60 * 60 * 24 * 30); }
        if (dateRange == '3M') { startTime = new Date().getTime() - (1000 * 60 * 60 * 24 * 92); }
        return startTime;
    };     
         
    var setMaxMinChart = function(startTime, endTime) {

        if (!largeChart) return;
        if (!endTime) endTime = Number.MAX_SAFE_INTEGER;
 
        var viewPortData = $.grep(largeChartData, function(item, index) { 
            return item[0] >= startTime && item[0] <= endTime;
        });
        var min = Math.min.apply(null, viewPortData.map(function(a){return a[1];}));
        var max = Math.max.apply(null, viewPortData.map(function(a){return a[1];}));
 
        largeChart.update({
            xAxis: {
                min: startTime
            },
            yAxis: {
                floor: min,
                ceiling: max
            }
        }); 
    }  

    Highcharts.LargeChart = function (a, b, c) {
    
        Highcharts.setOptions({
            lang:{
                rangeSelectorZoom: ''
            }
        });
    
        var hasRenderToArg = typeof a === 'string' || a.nodeName,
            options = arguments[hasRenderToArg ? 1 : 0],
            defaultOptions = {
                chart: {
                    renderTo: (options.chart && options.chart.renderTo) || this,
                    backgroundColor: 'transparent',
                    borderWidth: 0,
                    type: 'area',
                    margin: [0, 0, 0, 0],
                    height: 250,
                    style: {
                        overflow: 'visible'
                    },
                    skipClone: true
                },
                navigator: {
                    enabled: false
                },
                scrollbar: {
                    enabled: false
                },
                rangeSelector: {
                    buttonTheme: { 
                        fill: 'none',
                        stroke: 'none',
                        'stroke-width': 0,
                        style: {
                            color: '#707273'
                        },
                        states: {
                            hover: {
                            },
                            select: {
                                fill: '#dedede',
                                style: {
                                    color: '#707273'
                                }
                            }
                        }
                    },
                    buttonPosition: {
                        align: 'right',
                        x: 0,
                        y: 0
                    },
                    inputEnabled: false,
                    buttons: []
                },           
                title: {
                    text: ''
                },
                credits: {
                    enabled: false
                },
                xAxis: {
                    min: new Date().getTime() - (1000 * 60 * 60 * 24), // one day default
                    labels: {
                        enabled: false
                    },
                    title: {
                        text: null
                    },
                    startOnTick: false,
                    endOnTick: false,
                    tickPositions: []
                },
                yAxis: {
                    endOnTick: false,
                    startOnTick: false,
                
                    labels: {
                        enabled: false
                    },
                    title: {
                        text: null
                    },
                    gridLineWidth: 0
                },
                legend: {
                    enabled: false
                },
                tooltip: {
                    enabled: true,
                    formatter: function() {
                        return this.y.toFixed(2); 
                    }
                },
                plotOptions: {
                    series: {
                        color: '#FFA500',
                        animation: false,
                        lineWidth: 1,
                        shadow: false,
                        states: {
                            hover: {
                                lineWidth: 1
                            }
                        },
                        marker: {
                            enabled: false,
                            radius: 1,
                            states: {
                                hover: {
                                    radius: 2
                                }
                            }
                        },
                        fillOpacity: 0
                    },
                    column: {
                        negativeColor: '#000000',
                        borderColor: 'silver'
                    }
                }
            };
        
            options = Highcharts.merge(defaultOptions, options);

            chart = hasRenderToArg ?
                new Highcharts.stockChart(a, options, c) :
                new Highcharts.stockChart(options, b);
        
            largeChart = chart;
        
            return chart;
    };                                                                        