import React, { useState, useEffect } from 'react';
import { Table, TableHead, TableCell, Paper, TableRow, TableBody, Button, makeStyles, CssBaseline, Grid } from '@material-ui/core'
import { Link } from 'react-router-dom';
import { deleteFactor } from '../../services/factorService';
import Controls from "../../components/controls/Controls";
import { Alert, AlertTitle } from '@material-ui/lab/';
import IconButton from '@material-ui/core/IconButton';
import Collapse from '@material-ui/core/Collapse';
import CloseIcon from '@material-ui/icons/Close';
import CircularProgress from '@material-ui/core/CircularProgress';
import Fade from '@material-ui/core/Fade';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import { useParams } from "react-router-dom";
import Tooltip from '@mui/material/Tooltip';
import DeleteIcon from '@material-ui/icons/Delete';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import InfoIcon from '@material-ui/icons/Info';
import PageHeader from "../../components/PageHeader";
import TableContainer from '@material-ui/core/TableContainer';
import TablePagination from '@material-ui/core/TablePagination';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ButtonBase from '@material-ui/core/ButtonBase';
import axios from "axios";
import { CSVLink } from "react-csv"
import DownloadIcon from '@mui/icons-material/Download';

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
    buttonheader: {
        display: 'flex'

    },
    placeholder: {
        height: 40,
        textAlign: 'center'
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



export default function ViewFactors(props) {
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const { id } = useParams();
    const {role, ...other} = props;

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };
    const [factors, setFactors] = useState([]);
    const [open, setOpen] = React.useState(false);
    const [openDialog, setOpenDialog] = React.useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = React.useState(true);
    const [factorId, setFactorId] = React.useState('');;

    const classes = useStyles();

    function wrapValues(factors) {
        setFactors(factors);
        setLoading(false);
    }

    const handleClose = () => {
        setOpenDialog(false);
    };

    const handleAccept = () => {
        deleteFactorData()
        setOpenDialog(false);
    }

    const config = {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
    };

    async function getAllFactors() {
        try {
            const factors = await axios.get(
                `http://localhost:5000/api/private/factorbioprocess/${id}`,
                config
            );
            wrapValues(factors.data.factors);


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
        getAllFactors();
        return () => { unmounted = true; };
    }, [role]);

    const deleteFactorData = async () => {
        await deleteFactor(factorId, id);
        getAllFactors();
    }

    const headers = [
        { label: 'id', key: 'id' },
        { label: 'Nombre', key: 'name' },
        { label: 'Dependiente', key: 'isDependent' },        
        { label: 'Tipo', key: 'type' },
    ]

    const csvReport = {
        filename: 'Factors.csv',
        headers: headers,
        data: factors
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
                <DialogTitle id="alert-dialog-slide-title">{"¿Desea borrar este factor?"}</DialogTitle>
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


            <PageHeader
                title="Información sobre los factores"
                subTitle="Factores asociados a este bioproceso, necesarios para la predicción"
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
                        <Typography variant="h6" align="center">¿Se necesita un nuevo factor?</Typography>

                    </Box>
                    <Box textAlign='center'>
                        <Button color="primary" variant="contained" component={Link} to={`/factor/create/${id}`}>Crear factor</Button>
                    </Box>
                </Paper>
            </Grid>
            <div className={classes.placeholder} hidden={!loading}>
                <Fade
                    in={loading}
                    style={{
                        transitionDelay: '0m',
                    }}
                    unmountOnExit
                >
                    <CircularProgress />
                </Fade>
                <br />
            </div>
            <Collapse in={open}>
                <Alert

                    severity={error ? "error" : "success"}
                    action={
                        <IconButton
                            aria-label="close"
                            color="inherit"
                            size="small"
                            onClick={() => {
                                setOpen(false);
                            }}
                        >
                            <CloseIcon fontSize="inherit" />
                        </IconButton>
                    }
                >
                    <AlertTitle>{error ? error : "Success!"}</AlertTitle>
                    {error}
                </Alert>
            </Collapse>
            <Paper className={classes.table}>
                <TableContainer >
                    <div hidden={role? !role.export : false}>
                        <Grid
                            container
                            direction="row"
                            className={classes.csvContainer}
                        >
                            <Tooltip title="Exportar factores">
                                <div className={classes.iconContainer}>
                                    <CSVLink {...csvReport} style={{ color: 'white', marginLeft: '10px' }}>
                                        <DownloadIcon fontSize={'large'} />
                                    </CSVLink>
                                </div>
                            </Tooltip>
                        </Grid>
                    </div>
                    <Table stickyHeader aria-label="sticky table" className={classes.container}>
                        <TableHead>
                            <TableRow className={classes.thead}>
                                <TableCell>Nombre</TableCell>
                                <TableCell>¿Es valor dependiente?</TableCell>
                                <TableCell>Tipo</TableCell>
                                <TableCell className={classes.placeholder}>Acciones</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {factors.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((factor) => (
                                <TableRow hover className={classes.row} key={factor.id}>
                                    <TableCell>{factor.name}</TableCell>
                                    <TableCell>
                                        <Controls.Checkbox
                                            name="isDependent"
                                            label=""
                                            value={factor.isDependent}
                                            disabled={true}
                                        />
                                    </TableCell>
                                    <TableCell>{factor.type === 'value' ? 'Valor' : 'Imagen'}</TableCell>
                                    <TableCell >
                                        <div hidden={role? !role.editFactor : false}>
                                            <Grid
                                                container
                                                direction="row"
                                                justifyContent="center"
                                                alignItems="center"
                                            >
                                                <Tooltip title="Editar">
                                                    <Button color="primary" variant="contained" style={{ marginRight: 10 }} component={Link} to={`/factor/update/${factor._id}`}><ModeEditIcon /></Button>
                                                </Tooltip>
                                                <Tooltip title="Eliminar">
                                                    <Button color="secondary" variant="contained" onClick={() => {
                                                        setOpenDialog(true); setFactorId(factor._id); console.log(factor._id);
                                                    }}><DeleteIcon /></Button>
                                                </Tooltip>
                                            </Grid>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[10, 25, 100]}
                    component="div"
                    count={factors.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>
        </div>
    )
}
