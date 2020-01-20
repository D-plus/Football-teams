import React from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';

import { MuiThemeProvider, createMuiTheme } from '@material-ui/core';
import { toast } from 'react-toastify';
import './App.scss';
import 'react-toastify/dist/ReactToastify.css';
import WaitingComponent from './shared/hocs/WaitingComponent/WaitingComponent';

toast.configure();
const theme = createMuiTheme({
  typography: {
    fontFamily: '"Sulphur Point", serif',
  },
});

const TeamPage = React.lazy(() => import('./Team/TeamPage'));
const TeamsPage = React.lazy(() => import('./Teams/TeamsPage'));

const App = () => (
  <div className="app-wrapper">
    <MuiThemeProvider theme={theme}>
      <BrowserRouter>
        <Switch>
          <Route path="/team/:id" component={WaitingComponent(TeamPage)} />
          <Route path="/" exact component={WaitingComponent(TeamsPage)} />
          <Redirect to="/" />
        </Switch>
      </BrowserRouter>
    </MuiThemeProvider>
  </div>
);

export default App;
