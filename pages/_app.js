import * as React from 'react';

import '@styles/globals.css'
import {ThemeProvider, useTheme, createTheme} from '@mui/material/styles';
import {ColorModeContext} from '../components/ToggleColorMode';


function Application({Component, pageProps}) {
    const [mode, setMode] = React.useState('light');
    const colorMode = React.useMemo(
        () => ({
            toggleColorMode: () => {
                setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
            },
        }),
        [],
    );

    const theme = React.useMemo(
        () =>
            createTheme({
                palette: {
                    mode,
                },
            }),
        [mode],
    );

    return (
        <ColorModeContext.Provider value={colorMode}>
            <ThemeProvider theme={theme}>
                <Component {...pageProps} />
            </ThemeProvider>
        </ColorModeContext.Provider>
    )
}

export default Application
