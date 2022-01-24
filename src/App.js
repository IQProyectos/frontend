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
import UpdateFactor from './pages/Factors/UpdateFactor';
import CreateFactor from './pages/Factors/CreateFactor';
import ShowProgram from './pages/Program/ShowProgram';
import ShowTask from './pages/Task/ShowTask';
import TaskView from './pages/Task/TaskView';
import TaskForm from './pages/Task/TaskForm';
import ViewProgram from './pages/Program/ViewProgram';
import ViewReportsDeadlines from './pages/Report/ViewReportsDeadlines';
import ProgramForm from './pages/Program/ProgramForm';
import ShowBlog from './pages/Blog/ShowBlog';
import ViewBlog from './pages/Blog/ViewBlog';
import BlogForm from './pages/Blog/BlogForm';
import CreateData from './pages/Data/CreateData';
import ViewData from './pages/Data/ViewData';
import { esES } from '@mui/material/locale';
import ProjectForm from './pages/Project/ProjectForm';
import ViewProjects from './pages/Project/ViewProjects'
import ShowProject from './pages/Project/ShowProject';
import ReportForm from './pages/Report/ReportForm';
import ViewReports from './pages/Report/ViewReports'
import ShowReport from './pages/Report/ShowReport';
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
            
            <RequireAuth exact path='/project/create'>
              <Header />
              <SideMenu />
              <ProjectForm />
            </RequireAuth>

            <RequireAuth exact path='/report/create/:tid'>
              <Header />
              <SideMenu />
              <ReportForm />
            </RequireAuth>

            <RequireAuth exact path='/factor/create/:id'>
              <Header />
              <SideMenu />
              <CreateFactor />
            </RequireAuth>

            <RequireAuth exact path='/project/'>
              <Header />
              <SideMenu />
              <ViewProjects />
            </RequireAuth>

            <RequireAuth exact path='/report/'>
              <Header />
              <SideMenu />
              <ViewReportsDeadlines/>
            </RequireAuth>


            <RequireAuth exact path='/report/:id'>
              <Header />
              <SideMenu />
              <ViewReports />
            </RequireAuth>

            <RequireAuth exact path='/project/show/:id'>
              <Header />
              <SideMenu />
              <ShowProject />
            </RequireAuth>

            <RequireAuth exact path='/project/update/:id'>
              <Header />
              <SideMenu />
              <ProjectForm />
            </RequireAuth>


            <RequireAuth exact path='/report/show/:id'>
              <Header />
              <SideMenu />
              <ShowReport />
            </RequireAuth>

            

            <RequireAuth exact path='/report/update/:id/:tid'>
              <Header />
              <SideMenu />
              <ReportForm />
            </RequireAuth>
            <RequireAuth exact path='/task/:id'>
              <Header />
              <SideMenu />
              <TaskView />
            </RequireAuth>
            
            <RequireAuth exact path='/task/create/:tid'>
              <Header />
              <SideMenu />
              <TaskForm />
            </RequireAuth>

            <RequireAuth exact path='/task/update/:id/:tid'>
              <Header />
              <SideMenu />
              <TaskForm />
            </RequireAuth>

            <RequireAuth exact path='/task/show/:id'>
              <Header />
              <SideMenu />
              <ShowTask />
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

            <RequireAuth exact path='/program/show/:id'>
              <Header />
              <SideMenu />
              <ShowProgram />
            </RequireAuth>

            <RequireAuth exact path='/program/create'>
              <Header />
              <SideMenu />
              <ProgramForm />
            </RequireAuth>

            <RequireAuth exact path='/program/update/:id'>
              <Header />
              <SideMenu />
              <ProgramForm />
            </RequireAuth>

            <RequireAuth exact path='/program/'>
              <Header />
              <SideMenu />
              <ViewProgram />
            </RequireAuth>


            <RequireAuth exact path='/blog/show/:id'>
              <Header />
              <SideMenu />
              <ShowBlog />
            </RequireAuth>

            <RequireAuth exact path='/blog/create'>
              <Header />
              <SideMenu />
              <BlogForm />
            </RequireAuth>

            <RequireAuth exact path='/blog/update/:id'>
              <Header />
              <SideMenu />
              <BlogForm />
            </RequireAuth>


            <RequireAuth exact path='/blog/'>
              <Header />
              <SideMenu />
              <ViewBlog />
            </RequireAuth>

            <RequireAuth exact path='/data/add/:bid/:pid/:did'>
              <Header />
              <SideMenu />
              <CreateData />
            </RequireAuth>

            <RequireAuth exact path='/data/show/:bid/:pid/:did'>
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

            <RequireAuth exact path='/graphics/:bid/:pid/:did'>
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
