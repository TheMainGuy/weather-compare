import * as React from 'react';

import Head from 'next/head';

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
        <>
            <Head>
                <title>Tempsty</title>
                <script
                    async
                    src="https://www.googletagmanager.com/gtag/js?id=G-FWVETRFDNB"
                />
                <script
                    dangerouslySetInnerHTML={{
                        __html: `
                            window.dataLayer = window.dataLayer || [];
                            function gtag(){dataLayer.push(arguments);}
                            gtag('js', new Date());
                            gtag('config', 'G-FWVETRFDNB');
                            `,
                    }}
                />
            </Head>
            <ColorModeContext.Provider value={colorMode}>
                <ThemeProvider theme={theme}>
                    <Component {...pageProps} />
                </ThemeProvider>
            </ColorModeContext.Provider>
        </>
    )
}

export default Application
