import React, { useState, useEffect } from "react";
import dynamic from 'next/dynamic';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import AutocompleteTest from '../components/AutocompleteTest';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

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
    const [name, setName] = useState("");
    const [suggestions, setSuggestions] = useState([]);


    const updateData = (hash) => {
        fetch(`/api/city?id=${hash}`)
            .then(res => res.json()).then((result) => {
                const data = result.data;
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
    }

    const nameChanged = (value) => {
        setName(value);
        let matches = [];
        if (value.length > 2) {
            fetch(`/api/autocomplete?name=${value}`)
                .then(result => result.json())
                .then(result => {
                    if (result.data.matches) {
                        matches = result.data.matches;
                        setSuggestions(matches)
                    }
                });
        } else {
            setSuggestions(matches)
        }
    };

    const suggestionHandler = (suggestion) => {
        setName(`${suggestion.city} / ${suggestion.country}`);
        updateData(suggestion.id);
        setSuggestions([]);
    }

    return (
        <div className="app">
            <div className="row">
                <AutocompleteTest setSeries={setSeries}
                />
            </div>
            <div className="row">
                <label>
                    City Name:
                    <input
                        type="text"
                        value={name}
                        onChange={e => nameChanged(e.target.value)}
                    />
                    {suggestions && suggestions.map((suggestion, i) =>
                        <div className="suggestion"
                            key={i}
                            onClick={() => suggestionHandler(suggestion)}>{suggestion.city} / {suggestion.country}</div>
                    )}
                </label>

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
    );

}
