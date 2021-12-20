import React from 'react'
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid'
import InfoIcon from '@material-ui/icons/Info';
import PageHeader from "../../components/PageHeader";
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import CircularProgress from '@material-ui/core/CircularProgress';
import Fade from '@material-ui/core/Fade';
import Controls from "../../components/controls/Controls";
import axios from "axios";
import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';
import BarChartIcon from '@mui/icons-material/BarChart';
import PlaceIcon from '@material-ui/icons/Place';
import { Link } from 'react-router-dom';
import TableContainer from '@material-ui/core/TableContainer';
import TablePagination from '@material-ui/core/TablePagination';
import { Table, TableHead, TableCell, Paper, TableRow, TableBody, Button, CssBaseline } from '@material-ui/core'
import { useForm, Form } from '../../components/useForm';
import Tooltip from '@mui/material/Tooltip';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import ViewFactors from '../Factors/ViewFactors';
import defaultImg from '../../assets/img/defaultImg.jpeg'
import { ScrollToTop } from '../../components/ScrollToTop'
import { CSVDownloader } from 'react-papaparse'
import DownloadIcon from '@mui/icons-material/Download';
import { getPermissions } from '../../services/userService';

const useStyles = makeStyles(theme => ({
  cardContainer: {
    width: 800,
    justifyContent: "center",
    alignItems: "center"
  },
  media: {
    height: 300,
  },
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
    color: '#FFFFFF'
  },
  pageContent: {
    width: '90%',
    margin: '50px 0 0 0',
    padding: theme.spacing(3),
  },
  center: {
    display: 'flex',
    textAlign: 'center'
  },
  horizmenu: {
    display: 'inline-block'
  },
  textLeft: {
    marginLeft: '0',
    paddingLeft: '0'
  }
}));

const initialValue = {
  name: '',
  description: '',
  isTimeSeries: true,
  image: '',
  type: '',
  places: [],
  factors: []
}

const initialPlaceValues = {
  name: '',
  description: '',
  latitude: '',
  longitude: '',
  image: '',
  bioprocesses: []
}

const cleanPlace = {
  name: '',
  description: '',
  latitude: '',
  longitude: '',
  image: '',
  bioprocesses: []
}


export default function ShowBioprocesses() {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [toExport, setExport] = useState([]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  const [bioprocess, setBioprocess] = useState(initialValue);
  const { name, description, isTimeSeries, image, type, places, factors } = bioprocess;
  const [open, setOpen] = React.useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = React.useState(true);
  const [loadingAso, setLoadingAso] = React.useState(false);
  const [placesBio, setPlacesBio] = React.useState([]);
  const [filteredPlaces, setFilteredPlaces] = React.useState([{ name: "" }]);
  const [isPlacesBio, setIsPlacesBio] = React.useState(false);
  const [isEmpty, setIsEmpty] = React.useState(true);
  const [placeImage, setImage] = React.useState("");
  const userType = localStorage.getItem("type");
  const [role, setRole] = useState();
  const classes = useStyles();
  const { id } = useParams();
  useEffect( async() => {

    let unmounted = false;
    setLoading(true);
    if(userType === "user"){
      const response = await getPermissions(localStorage.getItem("uid"), id);
      setRole(response?.data?.role);
    }
    await getPlacesBio();
    await getFilteredPlaces();
    await getBioprocess();
    setLoading(false);
    return () => { unmounted = true; };
  }, []);

  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("authToken")}`,
    },
  };

  async function beautifyFactors(){
    const response = await axios.get(
      `http://localhost:5000/api/private/factorbioprocess/${id}`,
      config
    );
    let factorsExport = {};
    const factors = response.data.factors;
    for (const factor in factors){
      delete factors[factor]._id;
      delete factors[factor].__v;
      delete factors[factor].bioprocessID;
      factorsExport[`factor${factor}`] = Object.entries(factors[factor]);
    }
    return factorsExport;
  }

  function beautifyPlaces(){
    let placesExport = {};
    for (const place in placesBio) {
      delete placesBio[place]._id;
      delete placesBio[place].__v;
      delete placesBio[place].bioprocesses;
      placesExport[`place${place}`] = Object.entries(placesBio[place]);
    }
    return placesExport;
  }

  async function beautifyCSV(bioprocessP){

    const factors = await beautifyFactors();
    const places = beautifyPlaces();
    let toExport = {
      id: bioprocessP.id,
      name: bioprocessP.name,
      description: bioprocessP.description,
      isTimeSeries: bioprocessP.isTimeSeries,
      type: bioprocessP.type,
    }
    toExport = Object.assign(toExport,places);
    toExport = Object.assign(toExport,factors);
    setExport([toExport]);
  }

  const getBioprocess = async () => {
    try {
      
      let response = await axios.get(`http://localhost:5000/api/private/bioprocess/${id}`, config);
      setBioprocess(response.data.bioprocess);
      let data = response.data.bioprocess;
      
      beautifyCSV(data);
    } catch (error) {
      setTimeout(() => {
        setOpen(false);
        setTimeout(() => {
          setError("");
        }, 2000);

      }, 5000);
      setOpen(true);
      return setError("Authentication failed!");
    }
  }

  const getPlacesBio = async () => {
    try {
      let response = await axios.get(`http://localhost:5000/api/private/placebioprocess/${id}`, config);
      setPlacesBio(response.data.places);
      setLoading(false);
      if (response.data.places.length > 0)
        setIsPlacesBio(true);
    } catch (error) {
      setTimeout(() => {
        setOpen(false);
        setTimeout(() => {
          setError("");
        }, 2000);

      }, 5000);
      setOpen(true);
      return setError("Authentication failed!");
    }
  }

  const getFilteredPlaces = async () => {
    try {
      let response = await axios.get(`http://localhost:5000/api/private/filteredplace/${id}`, config);
      setFilteredPlaces(response.data.places);
    } catch (error) {
      setTimeout(() => {
        setOpen(false);
        setTimeout(() => {
          setError("");
        }, 2000);

      }, 5000);
      setOpen(true);
      return setError("Authentication failed!");


    }
  }

  const getPicturePlace = async (place) => {
    try {
      if (place) {
        let response = await axios.get(`http://localhost:5000/api/private/placePicture/${place.id}`, config);
        setImage(response.data.place.image);
      } else {
        setImage("");
      }
    } catch (error) {
      console.log(error);
    }
  }

  const validate = (fieldValues = values) => {
    let temp = { ...errors }
    if ('name' in fieldValues)
      temp.name = fieldValues.name ? "" : "Este campo es obligatorio."
    if ('description' in fieldValues)
      temp.description = fieldValues.description ? "" : "Este campo es obligatorio."
    if ('latitude' in fieldValues)
      temp.latitude = fieldValues.latitude ? "" : "Este campo es obligatorio."
    if ('longitude' in fieldValues)
      temp.longitude = fieldValues.longitude ? "" : "Este campo es obligatorio."
    setErrors({
      ...temp
    })

    if (fieldValues === values)
      return Object.values(temp).every(x => x === "")
  }

  const addNewPlace = async () => {
    try {
      setLoadingAso(true);
      values.bioprocesses.push(id);
      return await axios.post(`http://localhost:5000/api/private/place/`, values, config);
    } catch (error) {
      setTimeout(() => {
        setOpen(false);
        setTimeout(() => {
          setError("");
        }, 2000);

      }, 5000);
      setOpen(true);
      setLoadingAso(false);
      return setError("Authentication failed!");
    }
  }

  const updatePlace = async () => {
    try {
      setLoadingAso(true);
      placeValue.bioprocesses.push(id);
      return await axios.patch(`http://localhost:5000/api/private/place/${placeValue.id}`, placeValue, config);
    } catch (error) {
      setTimeout(() => {
        setOpen(false);
        setTimeout(() => {
          setError("");
        }, 2000);

      }, 5000);
      setOpen(true);
      setLoadingAso(false);
      return setError("Authentication failed!");
    }
  }

  const updateBioprocess = async (place) => {
    try {
      setLoadingAso(true);
      bioprocess.places.push(place._id);
      axios.patch(`http://localhost:5000/api/private/bioprocess/${id}`, bioprocess, config);
      setLoadingAso(false);
    } catch (error) {
      setTimeout(() => {
        setOpen(false);
        setTimeout(() => {
          setError("");
        }, 2000);

      }, 5000);
      setOpen(true);
      setLoadingAso(false);
      return setError("Authentication failed!");
    }
  }

  const associatePlace = async () => {
    await updatePlace().then(setLoadingAso(false));
    await updateBioprocess(placeValue).then(setLoadingAso(false));
    await getFilteredPlaces();
    await getPlacesBio();
    setPlaceValue(filteredPlaces[0]);
    setInputValue('');
    setIsEmpty(true);
    confirmPost();
  }

  const wrapPlace = async (place) => {
    await updateBioprocess(place).then(setLoadingAso(false));
    await getFilteredPlaces();
    await getPlacesBio();
    confirmPost();
  }



  const {
    values,
    setValues,
    errors,
    setErrors,
    handleInputChange,
    resetForm
  } = useForm(initialPlaceValues, true, validate);

  const confirmPost = () => {
    setOpen(true);
    resetForm({

    })
    setTimeout(function () {
      setOpen(false);
    }, 6000);
  }
  const handleSubmit = e => {
    e.preventDefault()
    if (validate()) {
      addNewPlace().then((response) => {
        setLoadingAso(false);
        setValues(cleanPlace);
        wrapPlace(response.data.Place);
      });

    }
  }

  const [placeValue, setPlaceValue] = React.useState(filteredPlaces[0]);
  const [inputValue, setInputValue] = React.useState('');

  function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
  }

  return (

    <div className={classes.root}>

      <div className={classes.placeholder} hidden={!loading} style={{ width: "90%" }}>
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
      <div className={classes.root}>
        <Snackbar open={open} autoHideDuration={3000}>
          <Alert severity={error ? "error" : "success"}>
            {error ? "Error!" : "Se ha asociado el lugar!"}
          </Alert>
        </Snackbar>
      </div>

      <Grid item>
        <Controls.Button variant="text" text="Información de lugares" className={classes.textLeft} href="#lugares" />
        <Controls.Button variant="text" text="Asociar lugar" className={classes.textLeft} href="#asociar" />
        <Controls.Button variant="text" text="Información de factores" className={classes.textLeft} href="#factores" />
      </Grid>
      <Grid
        container
        direction="row"
      >
        <Tooltip title="Exportar bioproceso">
          <div className={classes.iconContainer} hidden={role? !role.export : false}>
            <CSVDownloader
              data={toExport}
              filename={name}
              config={{}}
            >
              <DownloadIcon fontSize={'medium'} color={'success'} />
            </CSVDownloader>
          </div>
        </Tooltip>
      </Grid>
      <PageHeader
        title="Información detallada sobre un bioproceso"
        subTitle="Se mostrará también los lugares y factores asociados"
        icon={<InfoIcon fontSize="large"
        />}
      />
      <br id="lugares" />
      <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="center"
        style={{ width: "90%" }}
      >
        <Card className={classes.cardContainer}>

          <CardMedia
            className={classes.media}
            image={image ? image : defaultImg}
            title=""
          />
          <CardContent>
            <Typography gutterBottom variant="h5" component="h2">
              {name ? name : 'Nombre'}
            </Typography>
            <Typography variant="subtitle1" color="textSecondary" component="p">
              {description ? description : 'Descripción'}
            </Typography>
          </CardContent>

          <CardActions disableSpacing>
            <Typography variant="subtitle1" color="textSecondary" component="p">
              ¿Es serie temporal?
            </Typography>
            <Controls.Checkbox
              name="isTimeSeries"
              label=""
              value={isTimeSeries}
              disabled={true}
            />
            <Typography variant="subtitle1" color="textSecondary" component="p">
              Tipo: {type === 'clasificacion' ? 'Clasificación' : 'Regresión'}
            </Typography>
          </CardActions>
        </Card>
      </Grid>
      <br />
      <PageHeader
        title="Lugares asociados al bioproceso"
        subTitle="Se muestran todos los lugares asociados a este bioproceso"
        icon={<PlaceIcon fontSize="large"

        />}
      />

      <div className={classes.root}>
        <div hidden={!isPlacesBio}>
          <CssBaseline />
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
          <Paper className={classes.table}>
            <TableContainer >
              <Table stickyHeader aria-label="sticky table" className={classes.container}>
                <TableHead>
                  <TableRow className={classes.thead}>
                    <TableCell>Nombre</TableCell>
                    <TableCell>Latitud</TableCell>
                    <TableCell>Longitud</TableCell>
                    <TableCell className={classes.placeholder}>Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {placesBio.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((place) => (
                    <TableRow hover className={classes.row} key={place.id}>
                      <TableCell>{place.name}</TableCell>
                      <TableCell>{place.latitude}</TableCell>
                      <TableCell>{place.longitude}</TableCell>
                      <TableCell>
                        <Grid
                          container
                          direction="row"
                          justifyContent="center"
                          alignItems="center"
                        >
                          <Tooltip title="Información">
                            <Button className={classes.button} variant="contained" style={{ marginRight: 10 }} component={Link} to={`/place/show/${place._id}`}>
                              <InfoIcon />
                            </Button>
                          </Tooltip>
                          <Tooltip title="Graficar datos">
                            <Button color="secondary" variant="contained" style={{ marginRight: 10 }} component={Link} to={`/graphics/${id}/${place._id}`}>
                              <BarChartIcon />
                            </Button>
                          </Tooltip>
                          <Tooltip title="Mostrar datos">
                            <Button color="inherit" variant="contained" style={{ marginRight: 10 }} component={Link} to={`/data/show/${id}/${place._id}`}>
                              <VisibilityIcon />
                            </Button>
                          </Tooltip>
                          <Tooltip title="Agregar datos">
                            <Button color="primary" variant="contained" style={{ marginRight: 10 }} component={Link} to={`/data/add/${id}/${place._id}`}>
                              <AddIcon />
                            </Button>
                          </Tooltip>

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
              count={placesBio.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Paper>
        </div>
        <div className={classes.placeholder} hidden={isPlacesBio}>
          <br />
          <Typography variant="subtitle1" color="textSecondary" component="p">
            No hay nada qué mostrar en está sección
          </Typography>
        </div>
      </div>
      <br id="asociar" />
      <br />
      <PageHeader
        title="Asociar lugar a bioproceso"
        subTitle="Seleccione un lugar para asociarlo a este bioproceso"
        icon={<InfoIcon fontSize="large"
        />}
      />
      <div className={classes.placeholder} hidden={!loadingAso}>
        <Fade
          in={loadingAso}
          style={{
            transitionDelay: '0m',
          }}
          unmountOnExit
        >
          <CircularProgress />
        </Fade>
        <br />
      </div>
      <Paper className={classes.pageContent}>
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="center"
        >
          <Autocomplete
            value={placeValue}
            onChange={(event, newValue) => {
              getPicturePlace(newValue);
              setPlaceValue(newValue);

            }}
            className={classes.center}
            id="combo-box-places"
            options={filteredPlaces}
            getOptionLabel={(option) => option.name}
            style={{ width: 300 }}
            renderInput={(params) => <TextField {...params} label="Lugares" variant="outlined" />}
            disabled={loadingAso}
            inputValue={inputValue}
            onInputChange={(event, newInputValue) => {
              setInputValue(newInputValue);
              if (newInputValue === '') {
                setIsEmpty(true);
                setPlaceValue('');
              }
              else
                setIsEmpty(false);
            }}
          />

        </Grid>
        {/* <div hidden={!isEmpty}>

          <Form onSubmit={handleSubmit}>
            <br />
            <Divider />
            <br />
            <Grid
              container
              direction="row"
              justifyContent="center"
              alignItems="center"
            >
              <Typography variant="h5" color="primary" component="p" >
                Agregar lugar
              </Typography>
            </Grid>

            <br />
            <Grid
              container
              direction="row"
              justifyContent="center"
              alignItems="center"
              style={{textAlign: 'center'}}
            >
              <Grid item xs={6}>
                <Controls.Input
                  name="name"
                  label="Nombre"
                  value={values.name}
                  onChange={handleInputChange}
                  error={errors.name}
                />
                <Controls.Input
                  label="Descripción"
                  name="description"
                  value={values.description}
                  onChange={handleInputChange}
                  error={errors.description}
                />
              </Grid>
              <Grid item xs={6}>
                <Controls.Input
                  name="latitude"
                  label="Latitud"
                  value={values.latitude}
                  onChange={handleInputChange}
                  error={errors.name}
                />
                <Controls.Input
                  label="Longitud"
                  name="longitude"
                  value={values.longitude}
                  onChange={handleInputChange}
                  error={errors.description}
                />
              </Grid>

              <Grid
                container
                direction="row"
                justifyContent="center"
                alignItems="center"
                style={{marginTop: '20px'}}
              >

                <Controls.Button
                  type="submit"
                  text="AGREGAR Y ASOCIAR"
                />
              </Grid>
            </Grid>
          </Form>
        </div> */}

        <div hidden={isEmpty}>
          <br />
          <Grid
            container
            direction="row"
            justifyContent="center"
            alignItems="center"
          >
            <Card className={classes.cardContainer}>

              <CardMedia
                className={classes.media}
                image={placeImage ? placeImage : defaultImg}
                title=""
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="h2">
                  {placeValue ? placeValue.name : ''}
                </Typography>
                <Typography variant="subtitle1" color="textSecondary" component="p">
                  {placeValue ? placeValue.description : ''}
                </Typography>
              </CardContent>

              <CardActions>
                <Typography variant="subtitle1" color="primary" component="p">
                  <span >Latitud: </span>
                  {placeValue ? placeValue.latitude : ''}
                </Typography>
                <Typography variant="subtitle1" color="primary" component="p">
                  <span>Longitud: </span>
                  {placeValue ? placeValue.longitude : ''}
                </Typography>
              </CardActions>
            </Card>
          </Grid>
          <br />
          <Grid
            container
            direction="row"
            justifyContent="center"
            alignItems="center"
          >
            <Controls.Button
              text="Asociar lugar"
              color="primary"
              onClick={associatePlace} />
          </Grid>
        </div>
      </Paper>

      <br />
      <br />
      <div className={classes.placeholder} hidden={!loadingAso}>
        <Fade
          in={loadingAso}
          style={{
            transitionDelay: '0m',
          }}
          unmountOnExit
        >
          <CircularProgress />
        </Fade>
        <br />
      </div>
      <div id='factores'>
        <ViewFactors id={id} role={role}/>
      </div>
      <ScrollToTop showBelow={150} />

      <br />
      <br />
      <br />

    </div>
  );
}
