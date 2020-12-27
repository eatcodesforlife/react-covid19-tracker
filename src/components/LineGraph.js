import React, { useEffect, useState } from 'react'
import { Line } from 'react-chartjs-2'
import numeral from 'numeral'
import './LineGraph.css'

const buildGraphData = ( data, dataName ) => {

        const graphData = []
        let lastDataPoint = 0;

        for(let date in data[dataName]){
            
            if(lastDataPoint){
                const newDataPoint = {
                    x: date,
                    y: parseInt(data[dataName][date]) - lastDataPoint
                }
                 graphData.push(newDataPoint)
            }
            lastDataPoint = parseInt(data[dataName][date])
        }
        return graphData
    }


const options = {
  legend: {
    display: false,
  },
  elements: {
    point: {
      radius: 2,
    },
  },
  maintainAspectRatio: false,
  tooltips: {
    mode: "index",
    intersect: false,
    callbacks: {
      label: function (tooltipItem, data) {
        return numeral(tooltipItem.value).format("+0,0");
      },
    },
  },
  scales: {
    xAxes: [
      {
        type: "time",
        time: {
          format: "MM/DD/YY",
          tooltipFormat: "ll",
        },
      },
    ],
    yAxes: [
      {
        gridLines: {
          display: false,
        },
        ticks: {
          callback: function (value, index, values) {
            return numeral(value).format("0a");
          },
        },
      },
    ],
  },
};

const LineGraph = ({ dataName = 'cases' }) => {


    const [historicalData, setHistoricalData] = useState({})
    const xLabel = []
    const yLabel = []

    const labels = (data) => {
        for(let labels in data){
            yLabel.push(data[labels].y)
            xLabel.push(data[labels].x)
        }
    }      

    labels(historicalData)
    
    
    useEffect(() => {

        const getHistoricalData = async () => {
            const res = await fetch('https://disease.sh/v3/covid-19/historical/all?lastdays=120')
            const data = await res.json()
            return data
        }

        getHistoricalData()
            .then(data => {
                let chartData = buildGraphData(data, dataName)
                setHistoricalData(chartData)
            })

        getHistoricalData()
    }, [dataName])

    
    return (
        <div className='app__graph'>
            {historicalData?.length > 0 && (
                <Line 
                    data={{
                        type: 'line',
                        labels: [...xLabel],
                        datasets: [{
                            backgroundColor: 'rgb(255, 120, 120)',
                            borderColor: 'rgb(255, 55, 55)',
                            pointBackgroundColor: 'rgb(255, 55, 55)',
                            data: [...yLabel]
                        }]
                    }}
                    options = {options}
                />
            )}
            
        </div>
    )
}

export default LineGraph
