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
        fetch("/api/city?lat=46.8&lng=14&city=test")
            .then(res => res.json()).then((result) => {
                const data = result.data;
                console.log(JSON.stringify(result));
                setSeries(
                    [
                        {
                            name: data.city,
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
