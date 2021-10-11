import React, {useState, useEffect} from "react";
import dynamic from 'next/dynamic';
import AutocompleteTest from '../components/AutocompleteTest';
import Button from '@mui/material/Button';

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
    const [autocompletes, setAutocompletes] = useState(['autocomplete-0']);
    const [autocompleteRenders, setAutocompleteRenders] = useState([]);

    const addAutocomplete = () => {
        setAutocompletes([...autocompletes, 'autocomplete']);
        setSeries([...series, {
            name: "",
            data: []
        }]);
    };
    const removeAutocomplete = (index) => {
        setAutocompletes([...autocompletes.slice(0, index), ...autocompletes.slice(index + 1)]);
        setSeries([...series.slice(0, index), ...series.slice(index + 1)]);
    };

    useEffect(() => {
        setAutocompleteRenders(
            autocompletes.map((autocomplete, index) =>
                <div className="row" key={`row-${index}`}>
                    <AutocompleteTest id={`autocomplete-${index}`}
                                      index={index}
                                      series={series}
                                      setSeries={setSeries}
                    />
                    <Button onClick={() => {
                        removeAutocomplete(index);
                    }}>
                        Remove
                    </Button>
                </div>
            )
        )
    }, [autocompletes])

    return (
        <div className="app">
            <div className="container">
                {autocompleteRenders}
                <div className="row">
                    <Button onClick={() => {
                        addAutocomplete();
                    }}>
                        Add another
                    </Button>
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
