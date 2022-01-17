// withStyles & makeStyles

import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import CssBaseline from '@material-ui/core/CssBaseline';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import EcoIcon from '@material-ui/icons/Eco';
import HomeIcon from '@material-ui/icons/Home';
import AssignmentIndIcon from '@material-ui/icons/AssignmentInd';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import { useHistory } from "react-router-dom";
import PersonIcon from '@mui/icons-material/Person';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import BiotechIcon from '@mui/icons-material/Biotech';
import BeenhereIcon from '@mui/icons-material/Beenhere';

const drawerWidth = 240;



const useStyles = makeStyles((theme) => ({
    root: {
      display: 'flex',
    },
    appBar: {
      zIndex: theme.zIndex.drawer + 1,
    },
    drawer: {
      width: drawerWidth,
      flexShrink: 0,
    },
    drawerPaper: {
      width: drawerWidth,
    },
    drawerContainer: {
      overflow: 'auto',
    },
    content: {
      flexGrow: 1,
      padding: theme.spacing(3),
    },
  }));




  
export default function SideMenu() {

  const [value, setValue] = useState(localStorage.getItem("type"));

  useEffect(() => {
    console.log(value);
  }, [value])  


  const classes = useStyles();
  const history = useHistory();

  function moveRoute(route) {
    history.push(route);
  }

  function test(){
    const type = localStorage.getItem("type");
  }

  return (
    <div className={classes.root}>
      <CssBaseline />
      
      <Drawer
        className={classes.drawer}
        variant="permanent"
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <Toolbar />
        <div className={classes.drawerContainer}>
        <List>
            <ListItem button key={'programa'} onClick={() => moveRoute('/program')}>
              <ListItemIcon>{1 % 2 === 0 ? <InboxIcon /> : <BeenhereIcon />}</ListItemIcon>
              <ListItemText primary={'Programas'}/>
            </ListItem>
          </List>
          <Divider />
          <List>
            <ListItem button key={'proyecto'} onClick={() => moveRoute('/project/')}>
              <ListItemIcon>{1 % 2 === 0 ? <InboxIcon /> : <EcoIcon />}</ListItemIcon>
              <ListItemText primary={'Proyectos'}/>
            </ListItem>
          </List>
          <Divider />
          {value === 'admin' &&
            <div> 
              <List>
            <ListItem button key={'register'} onClick={() => moveRoute('/register')}>
              <ListItemIcon>{1 % 2 === 0 ? <InboxIcon /> : <PersonAddIcon />}</ListItemIcon>
              <ListItemText primary={'Registrar Usuario'}/>
            </ListItem>
          </List>
          <Divider />
          <List>
            <ListItem button key={'assignRole'} onClick={() => moveRoute('/assignRole')}>
              <ListItemIcon>{1 % 2 === 0 ? <InboxIcon /> : <AssignmentIndIcon />}</ListItemIcon>
              <ListItemText primary={'Asignar rol'}/>
            </ListItem>
          </List>
          <Divider />
          <List>
            <ListItem button key={'usuarios'} onClick={() => moveRoute('/users')}>
              <ListItemIcon>{1 % 2 === 0 ? <InboxIcon /> : <PersonIcon />}</ListItemIcon>
              <ListItemText primary={'Usuarios'}/>
            </ListItem>
          </List>
          <Divider />
            </div>
          }
          <List>
            <ListItem button key={'programa'} onClick={() => moveRoute('/blog')}>
              <ListItemIcon>{1 % 2 === 0 ? <InboxIcon /> : <NoteAddIcon/>}</ListItemIcon>
              <ListItemText primary={'Blog'}/>
            </ListItem>
          </List>
          <Divider />
        </div>
      </Drawer>
      
    </div>
  );
}

