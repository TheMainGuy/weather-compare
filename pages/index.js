import React, {useState, useEffect} from "react";
import dynamic from 'next/dynamic'

const Chart = dynamic(() => import('react-apexcharts'), {ssr: false});

export default function Home() {
    const [options, setOptions] = useState({
        chart: {
            id: "basic-bar",
            zoom: {
                enabled: false
            }
        },
        xaxis: {
            categories: ["January", "February", "March", "April", "May", "June", "July", "August", "September",
                "October", "November", "December"]
        },
        markers: {
            size: 5,
        },
    });
    const [series, setSeries] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        setSeries(
            [
                {
                    name: "series-1",
                    data: [12, 15, 19, 22, 24, 25, 27, 29, 25, 20, 17, 14]
                }
            ]
        )
        fetch("/api/city?lat=46.8&lng=14&name=test")
            .then(res => res.json()).then((result) => {
                const data = result.data;
                setSeries(
                    [
                        {
                            name: data.name,
                            data: data.monthly.map(month => Math.round(month.temperatureMax))
                        }
                    ]
                )
            }, (error) => {
                setError(error);
            }
        )
    }, [])

    return (
        <div className="app">
            <div className="row">
                <div className="mixed-chart">
                    <Chart
                        options={options}
                        series={series}
                        type="line"
                        width="1000"
                    />
                </div>
            </div>
        </div>
    );

}
