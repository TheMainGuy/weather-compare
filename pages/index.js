import React, {useState, useEffect} from "react";
import dynamic from 'next/dynamic';
import AutocompleteTest from '../components/AutocompleteTest';
import RemoveCityButton from '../components/RemoveCityButton';
import Box from '@mui/material/Box';
import ToggleColorMode from '../components/ToggleColorMode';
import { useTheme, ThemeProvider, createTheme } from '@mui/material/styles';

const Chart = dynamic(() => import('react-apexcharts'), {ssr: false});


export default function Home() {
    const theme = useTheme();
    useEffect(() => {
        setOptions({
            ...options,
            theme: {
                mode: theme.palette.mode
            }
        })
    }, [theme]);
    const [options, setOptions] = useState({
        chart: {
            height: 'auto',
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
        theme: {
            mode: theme.palette.mode
        },

        responsive: [{
            breakpoint: 480,
            options: {
                chart: {
                    height: '400'
                }
            }
        }],
    });
    const [series, setSeries] = useState([]);
    const [cityRenders, setCityRenders] = useState([]);

    const removeCity = (index) => {
        setSeries([...series.slice(0, index), ...series.slice(index + 1)]);
    };

    useEffect(() => {
        setCityRenders(
            series.map((series, index) =>
                <div key={`row-${index}`} className="remove-city-button">
                    <RemoveCityButton city={series.name}
                                      index={index}
                                      removeCity={removeCity}
                    />
                </div>
            )
        )
    }, [series])

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: 'background.default',
                color: 'text.primary',
                p: 3,
                overflowY: 'auto'
            }}
        >
            <div className="toggle">
                <ToggleColorMode/>
            </div>
            <div className="autocomplete-wrapper">
                <AutocompleteTest series={series}
                                  setSeries={setSeries}
                />
            </div>
            <div className="row remove-buttons">
                {cityRenders}
            </div>
            <div className="graph-wrapper">
                <div className="mixed-chart">
                    <Chart
                        options={options}
                        series={series}
                        type="line"
                    />
                </div>

            </div>
        </Box>
    );

}
