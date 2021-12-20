import './App.css';

import Header from "./components/Header";
import SideMenu from "./components/SideMenu";
import { makeStyles, CssBaseline, createTheme, ThemeProvider, Box } from '@material-ui/core';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import Login from './pages/User/Login';
import Home from './pages/Home'
import RequireAuth from './components/routing/RequireAuth';
import Register from './pages/User/Register'
import AssignRole from './pages/User/AssignRole';
import ViewBioprocesses from './pages/Bioprocess/ViewBioprocesses'
import ShowBioprocess from './pages/Bioprocess/ShowBioprocess';
import UpdateFactor from './pages/Factors/UpdateFactor';
import CreateFactor from './pages/Factors/CreateFactor';
import ShowPlace from './pages/Place/ShowPlace';
import ViewPlace from './pages/Place/ViewPlace';
import PlaceForm from './pages/Place/PlaceForm';
import CreateData from './pages/Data/CreateData';
import ViewData from './pages/Data/ViewData';
import { esES } from '@mui/material/locale';
import BioprocessForm from './pages/Bioprocess/BioprocessForm';
import ViewUsers from './pages/User/ViewUsers';
import Profile from './pages/User/Profile'
import Predictor from './pages/Predictor/Predictor';
import UploadCSV from './pages/Data/UploadCSV';
import ShowGraphics from './pages/Graphics/ShowGraphics';
import AboutUs from './pages/AboutUs';

const theme = createTheme({
  palette: {
    primary: {
      main: "#007E33",
      light: '#3c44b126'
    },
    secondary: {
      main: "#f83245",
      light: '#f8324526'
    },
    background: {
      default: "#f4f5fd"
    },
  },
  overrides: {
    MuiAppBar: {
      root: {
        transform: 'translateZ(0)'
      }
    }
  },
  props: {
    MuiIconButton: {
      disableRipple: true
    }
  }
},esES,);


const useStyles = makeStyles({
  appMain: {
    paddingLeft: '320px',
    width: '100%'
  },
})

function App() {
  const classes = useStyles();
  return (
    <Router>
      <ThemeProvider theme={theme}>
        <div>
          <Switch>
            <Route exact path="/login" component={Login}/>
          </Switch>
        </div>

        <div className={classes.appMain}>
        <Box m={10}></Box>
          
          <Switch>
            <Route exact path="/about" component={AboutUs}/>
            
            <RequireAuth exact path='/'>   
              <Header />
              <SideMenu />
              <Home />           
            </RequireAuth>
            
            <RequireAuth exact path='/bioprocess/create'>
              <Header />
              <SideMenu />
              <BioprocessForm />
            </RequireAuth>

            <RequireAuth exact path='/factor/create/:id'>
              <Header />
              <SideMenu />
              <CreateFactor />
            </RequireAuth>

            <RequireAuth exact path='/bioprocess/'>
              <Header />
              <SideMenu />
              <ViewBioprocesses />
            </RequireAuth>

            <RequireAuth exact path='/bioprocess/show/:id'>
              <Header />
              <SideMenu />
              <ShowBioprocess />
            </RequireAuth>

            <RequireAuth exact path='/bioprocess/update/:id'>
              <Header />
              <SideMenu />
              <BioprocessForm />
            </RequireAuth>

            <RequireAuth exact path='/register'>
              <Header />
              <SideMenu />
              <Register />
            </RequireAuth>

            <RequireAuth exact path='/assignRole'>
              <Header />
              <SideMenu />
              <AssignRole />
            </RequireAuth>

            <RequireAuth exact path='/users'>
              <Header />
              <SideMenu />
              <ViewUsers />
            </RequireAuth>

            <RequireAuth exact path='/profile/:id'>
              <Profile />
            </RequireAuth>

            <RequireAuth exact path='/factor/update/:id'>
              <Header />
              <SideMenu />
              <UpdateFactor />
            </RequireAuth>

            <RequireAuth exact path='/place/show/:id'>
              <Header />
              <SideMenu />
              <ShowPlace />
            </RequireAuth>

            <RequireAuth exact path='/place/create'>
              <Header />
              <SideMenu />
              <PlaceForm />
            </RequireAuth>

            <RequireAuth exact path='/place/update/:id'>
              <Header />
              <SideMenu />
              <PlaceForm />
            </RequireAuth>


            <RequireAuth exact path='/place/'>
              <Header />
              <SideMenu />
              <ViewPlace />
            </RequireAuth>

            <RequireAuth exact path='/data/add/:bid/:pid'>
              <Header />
              <SideMenu />
              <CreateData />
            </RequireAuth>

            <RequireAuth exact path='/data/show/:bid/:pid'>
              <Header />
              <SideMenu />
              <ViewData />
            </RequireAuth>

            <RequireAuth exact path='/predictor/'>
              <Header />
              <SideMenu />
              <Predictor />
            </RequireAuth>

            <RequireAuth exact path='/uploadCSV/'>
              <Header />
              <SideMenu />
              <UploadCSV />
            </RequireAuth>

            <RequireAuth exact path='/graphics/:bid/:pid'>
              <Header />
              <SideMenu />
              <ShowGraphics />
            </RequireAuth>

            <Redirect to="/login" />
          </Switch>

        </div>
        <CssBaseline />
      </ThemeProvider>
    </Router>
  );
}

export default App;
