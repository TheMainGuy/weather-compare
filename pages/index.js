import React from "react";
import dynamic from 'next/dynamic'

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

export default function Home() {
    const data = {
        options: {
            chart: {
                id: "basic-bar"
            },
            xaxis: {
                categories: ["January", "February", "March", "April", "May", "June", "July", "August", "September",
                    "October", "November", "December"]
            }
        },
        series: [
            {
                name: "series-1",
                data: [12, 15, 19, 22, 24, 25, 27, 29, 25, 20, 17, 14, 10]
            }
        ]
    };


    return (
        <div className="app">
            <div className="row">
                <div className="mixed-chart">
                    <Chart
                        options={data.options}
                        series={data.series}
                        type="line"
                        width="1000"
                    />
                </div>
            </div>
        </div>
    );

}
