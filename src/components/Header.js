import React from 'react'
import { AppBar, Toolbar, makeStyles, CssBaseline } from '@material-ui/core'
import MenuIcon from '@material-ui/icons/Menu';
import Typography from '@material-ui/core/Typography';
import clsx from 'clsx';
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import IconButton from "@material-ui/core/IconButton";
import { useHistory } from "react-router-dom";
import AccountCircle from "@material-ui/icons/AccountCircle";
import Avatar from '@material-ui/core/Avatar';

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
    toolbarButtons: {
        marginLeft: 'auto',
    },

}));

export default function Header() {
    const history = useHistory();
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const image = localStorage.getItem("image");
    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const logoutHandler = () => {
        localStorage.removeItem("authToken");
        history.push("/login");
    };
    const classes = useStyles();

    const profileHandler = () =>{
        const uid = localStorage.getItem("uid");
        history.push(`/profile/${uid}`);
    }

    const home= () =>{
        history.push("/")
    }

    return (
        <div className={classes.root}>
            <CssBaseline />
            <AppBar position="fixed" className={classes.appBar}>
                <Toolbar>
                    <div onClick={home}>
                        <IconButton 
                            color="inherit"    
                        >
                            <Typography variant="h6" noWrap >
                                Scyto: Gestor de servicios de laboratorios
                            </Typography>
                        </IconButton>
                        
                    </div>
                    <div className={classes.toolbarButtons}>
                        <IconButton
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleMenu}
                            color="inherit"
                        >
                            <Avatar
                            src={image? image: ""}
                            alt=""                            
                            >

                            </Avatar>
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            getContentAnchorEl={null}
                            anchorEl={anchorEl}
                            anchorOrigin={{
                                vertical: "bottom",
                                horizontal: "center",
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: "top",
                                horizontal: "center",
                            }}
                            open={open}
                            onClose={handleClose}
                        >
                            <MenuItem onClick={profileHandler}>Ver Perfil</MenuItem>
                            <MenuItem onClick={logoutHandler}>Salir</MenuItem>
                        </Menu>
                    </div>

                </Toolbar>

            </AppBar>
        </div>
    )
}
