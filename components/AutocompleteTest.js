import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';

function sleep(delay = 0) {
    return new Promise((resolve) => {
        setTimeout(resolve, delay);
    });
}

export default function Asynchronous(props) {
    const {index, series, setSeries} = props;
    const [open, setOpen] = React.useState(false);
    const [options, setOptions] = React.useState([]);
    const [loading, setLoading] = React.useState(false);


    const inputChanged = (value) => {
        setLoading(true);
        let matches = [];
        if (value.length > 2) {
            fetch(`/api/autocomplete?name=${value}`)
                .then(result => result.json())
                .then(result => {
                    if (result.data.matches) {
                        matches = result.data.matches;
                        setOptions(matches);
                        setLoading(false);
                    }
                });
        } else {
            setOptions(matches)
            setLoading(false);
        }
    };

    React.useEffect(() => {
        if (!open) {
            setOptions([]);
        }
    }, [open]);

    const updateSeries = (value) => {
        let newValue = [...series.slice(0, index), value, ...series.slice(index + 1)];
        setSeries(newValue);
    }
    const citySelected = (city) => {
        if (!city) {return;}
        fetch(`/api/city?id=${city.id}`)
            .then(res => res.json()).then((result) => {
                const data = result.data;
                updateSeries(
                    {
                        name: data.city,
                        data: data.monthly.map(month => Math.round(month.temperatureMax))
                    }
                )
            }, (error) => {
                setError(error);
            }
        )
    }

    return (
        <Autocomplete
            id="asynchronous-demo"
            sx={{ width: 300 }}
            open={open}
            onOpen={() => {
                setOpen(true);
            }}
            onClose={() => {
                setOpen(false);
            }}
            isOptionEqualToValue={(option, value) => option.title === value.title}
            getOptionLabel={(option) => `${option.city} / ${option.country}`}
            onInputChange={(event, value) => inputChanged(value)}
            onChange={(event, value) => citySelected(value)}
            options={options}
            loading={loading}
            renderOption={(props, option) => {
                return (
                    <li {...props} key={option.id}>
                        {`${option.city} / ${option.country}`}
                    </li>
                );
            }}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label="Asynchronous"
                    InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                            <React.Fragment>
                                {loading ? <CircularProgress color="inherit" size={20} /> : null}
                                {params.InputProps.endAdornment}
                            </React.Fragment>
                        ),
                    }}
                />
            )}
        />
    );
}
