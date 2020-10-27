import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import {CssBaseline, ThemeProvider} from "@material-ui/core";
import createMuiTheme from "@material-ui/core/styles/createMuiTheme";
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import SpotifyCallback from "./callbacks/Spotify";
import DeezerCallback from "./callbacks/Deezer";

import './locales'

const theme = createMuiTheme({
  palette: {
    type: 'dark',
    secondary: {
      main: '#FD0F57',
    },
    primary: {
      main: '#FD0F57'
    },
    background: {
      default: '#000000'
    },
    action: {
      active: '#000'
    },
  },
  typography: {
    fontFamily: [
      'Montserrat',
      '"Segoe UI"',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
    button: {
      fontWeight: 900,
      color: 'black'
    },
  }
})

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline/>
      <BrowserRouter>
        <Switch>
          <Route path="/auth/spotify">
            <SpotifyCallback/>
          </Route>
          <Route path="/auth/deezer"p>
            <DeezerCallback/>
          </Route>
          <Route path="/" exact>
            <App/>
          </Route>
        </Switch>
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.unregister();
