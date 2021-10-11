import React, {useState, useEffect} from "react";
import dynamic from 'next/dynamic';
import AutocompleteTest from '../components/AutocompleteTest';
import RemoveCityButton from '../components/RemoveCityButton';

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
    const [cityRenders, setCityRenders] = useState([]);

    const removeCity = (index) => {
        setSeries([...series.slice(0, index), ...series.slice(index + 1)]);
    };

    useEffect(() => {
        setCityRenders(
            series.map((series, index) =>
                <div key={`row-${index}`}>
                    <RemoveCityButton city={series.name}
                                      index={index}
                                      removeCity={removeCity}
                    />
                </div>
            )
        )
    }, [series])

    return (
        <div className="app">
            <div className="container">
                <div className="row">
                    <AutocompleteTest series={series}
                                      setSeries={setSeries}
                    />
                </div>
                <div className="row remove-buttons">
                    {cityRenders}
                </div>
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
        </div>
    );

}
