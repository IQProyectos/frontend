import React, { useState, useEffect } from 'react';
import { Table, TableHead, TableCell, Paper, TableRow, TableBody, Button, makeStyles, CssBaseline, Grid } from '@material-ui/core'
import { Link } from 'react-router-dom';
import { deleteBioprocess } from '../../services/bioprocessService';
import Controls from "../../components/controls/Controls";
import DeleteIcon from '@material-ui/icons/Delete';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import CircularProgress from '@material-ui/core/CircularProgress';
import Fade from '@material-ui/core/Fade';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import Tooltip from '@mui/material/Tooltip';
import InfoIcon from '@material-ui/icons/Info';
import LogoutIcon from '@mui/icons-material/Logout';
import PageHeader from "../../components/PageHeader";
import TableContainer from '@material-ui/core/TableContainer';
import TablePagination from '@material-ui/core/TablePagination';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import axios from "axios";
import AlertMessage from '../../components/AlertMessage';
import { CSVLink } from "react-csv"
import DownloadIcon from '@mui/icons-material/Download';
import Download from '@mui/icons-material/Download';
import { jsonToCSV, CSVDownloader } from 'react-papaparse';
import {getUsers, editRoles} from '../../services/userService';
import { version } from 'react-dom/cjs/react-dom.development';

const useStyles = makeStyles((theme) => ({
    table: {
        width: '90%',
        margin: '50px 0 0 0'
    },
    thead: {
        '& > *': {
            fontSize: 20,
            background: '#8ade8f',
            color: '#FFFFFF'
        }
    },
    head: {
        fontSize: 20,
        background: '#8ade8f',
        color: '#FFFFFF'

    },
    row: {
        '& > *': {
            fontSize: 18
        }
    },
    cell: {
        paddingTop: 0
    },
    buttonheader: {
        display: 'flex'

    },
    placeholder: {
        height: 40,
        textAlign: 'center'
    },
    placeholderLoading: {
        height: 40,
        textAlign: 'center',
        width: '90%'
    },
    button: {
        background: '#4287f5',
        color: '#FFFFFF',
        justifyContent: 'center'
    },
    paper: {
        width: '100%',
        height: '100%',
        backgroundColor: 'white',
        padding: 8
    },
    csvContainer: {
        fontSize: 20,
        background: '#8ade8f',

    },
    iconContainer: {
        color: 'white',
        textDecoration: 'none',
    }

}));


const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});



export default function ViewBioprocess() {
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };
    const [bioprocesses, setBioprocesses] = useState([]);
    const [open, setOpen] = React.useState(false);
    const [openDialog, setOpenDialog] = React.useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = React.useState(true);
    const [bioprocessId, setBioprocessId] = React.useState('');
    const [openDialogAbandon, setOpenDialogAbandon] = useState(false);
    const [currentUserRoles, setCurrentUserRoles] = useState({});
    const [isAdmin, setIsAdmin] = useState(false);

    const classes = useStyles();

    function wrapValues(bioprocesses) {
        setBioprocesses(bioprocesses);
        setLoading(false);
    }

    const handleClose = () => {
        setOpenDialog(false);
    };

    const handleAccept = () => {
        deleteBioprocessData()
        setOpenDialog(false);
    }

    const handleCloseAbandon = () => {
        setOpenDialogAbandon(false);
    };

    const handleAcceptAbandon = () => {
        abandonBioprocess();
        setOpenDialogAbandon(false);
    };

    const headers = [
        { label: 'id', key: 'id' },
        { label: 'Descripción', key: 'description' },
        { label: 'Nombre', key: 'name' },
        { label: 'Tipo', key: 'type' },
    ]

    const csvReport = {
        filename: 'Bioprocesses.csv',
        headers: headers,
        data: bioprocesses
    }

    const config = {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
    };

    async function getAllBioprocesses() {
        try {
            const bioprocesses = await axios.get(
                "http://localhost:5000/api/private/bioprocess",
                config
            );
            
            const currentUser = await getUsers(localStorage.getItem("uid"));
            if(currentUser.data.user.type === "admin"){
                wrapValues(bioprocesses.data.bioprocesses);
                setIsAdmin(true);

            }else{
                setCurrentUserRoles(currentUser.data.user.roles);
                let permittedBioprocesses = [];

                currentUser.data.user.roles.forEach(element => {
                    permittedBioprocesses.push(element.bioprocessId);
                });

                console.log(permittedBioprocesses);

                let valuesToWrap = [];

                bioprocesses.data.bioprocesses.forEach(element => {
                    if(permittedBioprocesses.includes(element._id)){
                        valuesToWrap.push(element);
                    }
                });

                wrapValues(valuesToWrap);
            }
            
            


        } catch (error) {
            setTimeout(() => {
                setTimeout(() => {
                    setError("");
                }, 2000);
            }, 5000);
            return setError("Authentication failed!");
        }
        

        

    }
    useEffect(() => {
        let unmounted = false;
        getAllBioprocesses();
        
        
        
        return () => { unmounted = true; };
        

    }, []);

    const deleteBioprocessData = async () => {
        try {
            let response = await deleteBioprocess(bioprocessId);
            getAllBioprocesses();
        } catch (error) {
            setOpen(true);
            setError(error.message);
            setTimeout(function () {
                setOpen(false);
                setError("");
            }, 3000);
        }


    }

    const abandonBioprocess = async () => {
        let newRoles = []
        currentUserRoles.forEach(element => {
            if(element.bioprocessId !== bioprocessId){
                newRoles.push(element);
            }
        });

        editRoles(localStorage.getItem("uid"), newRoles);
        getAllBioprocesses();
    }

    return (
        <div className={classes.root}>
            <CssBaseline />
            <Dialog
                open={openDialog}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleClose}
                aria-labelledby="alert-dialog-slide-title"
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle id="alert-dialog-slide-title">{"¿Desea borrar este bioproceso?"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-slide-description">
                        Esta decisión no es reversible.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancelar
                    </Button>
                    <Button onClick={handleAccept} color="secondary">
                        Eliminar
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog
                open={openDialogAbandon}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleCloseAbandon}
                aria-labelledby="alert-dialog-slide-title"
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle id="alert-dialog-slide-title">{"¿Desea abandonar este bioproceso?"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-slide-description">
                        Esta decisión no es reversible.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseAbandon} color="primary">
                        Cancelar
                    </Button>
                    <Button onClick={handleAcceptAbandon} color="secondary">
                        Abandonar
                    </Button>
                </DialogActions>
            </Dialog>


            <PageHeader
                title="Información sobre los bioprocesos"
                subTitle="Acá se muestran todos los bioprocesos en el sistema"
                icon={<InfoIcon fontSize="large"
                />}
            />


            <Grid
                container
                direction="row"
                justifyContent="center"
                alignItems="center"
                className={classes.table}
            >
                <Paper className={classes.paper} elevation={3}>
                    <Box sx={{ width: 'auto' }} padding>
                        <Typography variant="h6" align="center">¿Se necesita un nuevo bioproceso?</Typography>
                    </Box>
                    <Box textAlign='center'>
                        <Controls.Button color="primary" variant="contained" component={Link} to={`/bioprocess/create/`} text="Crear bioproceso" />
                    </Box>

                </Paper>

            </Grid>

            <div className={classes.placeholderLoading} hidden={!loading}>
                <br />
                <Fade
                    in={loading}
                    style={{
                        transitionDelay: '0m',
                    }}
                    unmountOnExit
                >
                    <CircularProgress />
                </Fade>

            </div>

            <Paper className={classes.table}>
                <AlertMessage errorMessage={error} successMessage={""} openMessage={open} />
                <TableContainer >
                    {/* <div className={classes.test}>
                    <CSVDownloader
                        data= {bioprocesses}
                        filename={'bioprocesses'}
                        config={{}}
                    > Download</CSVDownloader>
                    </div> */}
                    <Grid
                        container
                        direction="row"
                        className={classes.csvContainer}
                    >
                        <Tooltip title="Exportar bioprocesos">
                            <div className={classes.iconContainer}>
                                <CSVLink {...csvReport} style={{color:'white', marginLeft: '10px'}}> 
                                    <DownloadIcon fontSize={'large'} />
                                </CSVLink>
                            </div>
                        </Tooltip>
                    </Grid>
                    <Table stickyHeader aria-label="sticky table" className={classes.container}>

                        <TableHead>
                            <TableRow className={classes.thead}>
                                <TableCell className={classes.cell}>Nombre</TableCell>
                                <TableCell className={classes.cell}>¿Es serie temporal?</TableCell>
                                <TableCell className={classes.cell}>Tipo</TableCell>
                                <TableCell className={classes.placeholder} style={{paddingTop: '0px'}}>Acciones</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {bioprocesses.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((bioprocess) => (
                                <TableRow hover className={classes.row} key={bioprocess.id}>
                                    <TableCell>{bioprocess.name}</TableCell>
                                    <TableCell>
                                        <Controls.Checkbox
                                            name="isTimeSeries"
                                            label=""
                                            value={bioprocess.isTimeSeries}
                                            disabled={true}
                                        />
                                    </TableCell>
                                    <TableCell>{bioprocess.type === 'regresion' ? 'Regresión' : 'Clasificación'}</TableCell>
                                    <TableCell>
                                        <Grid
                                            container
                                            direction="row"
                                            justifyContent="center"
                                            alignItems="center"
                                        >
                                            <Tooltip title="Editar">
                                                <Button color="primary" variant="contained" style={{ marginRight: 10 }} component={Link} to={`/bioprocess/update/${bioprocess._id}`}><ModeEditIcon /></Button>
                                            </Tooltip>
                                            <Tooltip title="Información">
                                                <Button className={classes.button} variant="contained" style={{ marginRight: 10 }} component={Link} to={`/bioprocess/show/${bioprocess._id}`}><InfoIcon /></Button>
                                            </Tooltip>
                                            <Tooltip title="Eliminar">
                                                <Button color="secondary" variant="contained" style={{ marginRight: 10 }}  onClick={() => {
                                                    setOpenDialog(true); setBioprocessId(bioprocess._id);
                                                }}><DeleteIcon /></Button>
                                            </Tooltip>
                                            {!isAdmin &&
                                                <Tooltip title="Abandonar Bioproceso">
                                                    <Button color="warning" variant="contained" onClick={() => {
                                                        setOpenDialogAbandon(true); setBioprocessId(bioprocess._id);
                                                    }}><LogoutIcon /></Button>
                                                </Tooltip>
                                            }
                                            
                                        </Grid>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[10, 25, 100]}
                    component="div"
                    count={bioprocesses.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>
        </div>
    )
}
