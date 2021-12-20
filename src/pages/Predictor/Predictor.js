import React, { useState, useEffect } from 'react';
import PageHeader from "../../components/PageHeader";
import BiotechIcon from '@mui/icons-material/Biotech';
import { Paper, Grid, makeStyles } from '@material-ui/core'
import BioprocessSelector from './BioprocessSelector';
import PlaceSelector from './PlaceSelector';
import DateRangeSelector from './DateRangeSelector';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Controls from "../../components/controls/Controls";
import { Link } from 'react-router-dom';
import EcoIcon from '@material-ui/icons/Eco';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { addPrediction } from '../../services/predictionService';

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

}));

export default function Predictor() {
    const classes = useStyles();
    const [bioprocess, setBioprocess] = useState("");
    const [place, setPlace] = useState("");
    const [initialDate, setInitialDate] = useState("");
    const [finalDate, setFinalDate] = useState("");

    const [bioprocessName, setBioprocessName] = useState("");
    const [placeName, setPlaceName] = useState("");

    useEffect(() => {
        setPlace("");
        setPlaceName("");
    }, [bioprocess]);

    const handleSubmit = async e => {
        e.preventDefault()
        if(initialDate !== "" && finalDate !== "" && bioprocess !== "" && place !== ""){
            let values = {
                bioprocessID: bioprocess,
                placeID: place,
                initialDate: initialDate,
                finalDate: finalDate
            }
            console.log(values);
            addPrediction(values);

        }else{
            console.log("Error: Falta al menos un dato")
        }
    }

    return (
        <div>
            <PageHeader
                title="Realizar Predicción"
                subTitle="Siga los pasos encontrados en esta página, al finalizar, dirijase al botón al final de la página."
                icon={<BiotechIcon fontSize="large"
                />}
            />
            <br />
             <PageHeader
                title="Elija un bioproceso"
                subTitle="Elija el bióproceso al que le desea hacer una predicción."
                icon={<EcoIcon fontSize="large"
                />}
            />
            <BioprocessSelector setBioprocess={setBioprocess} setBioprocessName={setBioprocessName}/>
            <Grid
                container
                direction="row"
                justifyContent="center"
                alignItems="center"
                className={classes.table}
            >
                <Paper className={classes.paper} elevation={3}>
                    <Box sx={{ width: 'auto' }} padding>
                        <Typography variant="h5" align="center">Bioproceso Seleccionado:</Typography>
                        <Typography variant="h6" align="center">{bioprocessName}</Typography>
                    </Box>
                </Paper>

            </Grid>
            <br />
            <PageHeader
                title="Elija un lugar"
                subTitle="Elija el lugar realacionado al bioproceso seleccionado al que le desea hacer una predicción."
                icon={<LocationOnIcon fontSize="large"
                />}
            />
            <PlaceSelector id={bioprocess} setPlace={setPlace} setPlaceName={setPlaceName}/>
            <Grid
                container
                direction="row"
                justifyContent="center"
                alignItems="center"
                className={classes.table}
            >
                <Paper className={classes.paper} elevation={3}>
                    <Box sx={{ width: 'auto' }} padding>
                        <Typography variant="h5" align="center">Lugar Seleccionado:</Typography>
                        <Typography variant="h6" align="center">{placeName}</Typography>
                    </Box>
                </Paper>

            </Grid>
            <br />
            <PageHeader
                title="Elija un rango de fechas"
                subTitle="Los datos encontrados en este rango de fecha serán utilizados para realizar la predicción."
                icon={<CalendarTodayIcon fontSize="large"
                />}
            />
            <br />
            <DateRangeSelector setInitialDate={setInitialDate} setFinalDate={setFinalDate}/>
            <Grid
                container
                direction="row"
                justifyContent="center"
                alignItems="center"
                className={classes.table}
            >
                <Paper className={classes.paper} elevation={3}>
                    <Box sx={{ width: 'auto' }} padding>
                        <Typography variant="h5" align="center">Datos a utilizar para la predicción:</Typography>
                        <Typography variant="h6" align="center">Bioproceso: {bioprocessName}</Typography>
                        <Typography variant="h6" align="center">Lugar: {placeName}</Typography>
                        <Typography variant="h6" align="center">FechaInicial: {initialDate}</Typography>
                        <Typography variant="h6" align="center">FechaFinal: {finalDate}</Typography>
                    </Box>
                    <Box textAlign='center'>
                        <Controls.Button color="primary" variant="contained" onClick={handleSubmit} text="Realizar Predicción"/>
                    </Box>

                </Paper>

            </Grid>
            <br />

        </div>
    )
}
