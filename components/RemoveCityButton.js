import {useState} from 'react';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';

export default function RemoveCityButton(props) {
    const {city, index, removeCity} = props;
    const [hover, setHover] = useState(false);
    return (
        <Button
            variant="contained"
            startIcon={<DeleteIcon/>}
            onClick={() => {
            removeCity(index)
        }}
                onMouseOver={() => setHover(true)}
                onMouseOut={() => setHover(false)}
        >
            {city}
        </Button>
    );
}