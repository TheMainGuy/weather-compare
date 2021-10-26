import Box from '@mui/material/Box';
import ToggleColorMode from '../components/ToggleColorMode';
import Button from '@mui/material/Button';
import Link from 'next/link'


import {useTheme} from '@mui/material/styles';

export default function Home() {
    const theme = useTheme();

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
                minHeight: '100%',
                alignItems: 'center',
                bgcolor: 'background.default',
                color: 'text.primary',
                p: 3,
                overflowY: 'auto',
                overflowX: 'hidden'
            }}
        >
            <div className="header">
                <div className="invisible-filler">
                    <div className="toggle-wrapper">
                        <ToggleColorMode/>
                    </div>
                </div>
                <div className="header-text">
                    <h2>
                        About
                    </h2>
                </div>
                <div className="action-bar">
                    <div className="toggle-wrapper">
                        <ToggleColorMode/>
                    </div>
                </div>
            </div>
            <div className="description">
                A simple and beautiful site for comparing weather statistics.
            </div>
            <div className="description">
                Development in progress...
            </div>
            <Link href="/">
                <Button>
                    Home
                </Button>
            </Link>
        </Box>
    );

}
