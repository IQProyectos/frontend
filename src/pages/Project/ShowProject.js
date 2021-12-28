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
import ProgramIcon from '@material-ui/icons/Place';
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
  programholder: {
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
  objetives: '',
  justification: '',
  country: '',
  department: '',
  district: '',
  definition: '',
  isTimeSeries: true,
  image: '',
  programs: [],
  factors: []
}

const initialProgramValues = {
  name: '',
  description: '',
  objetivesProgram: '',
  definitionProgram: '',
  image: '',
  projects: []
}

const cleanProgram = {
  name: '',
  description: '',
  objetivesProgram: '',
  definitionProgram: '',
  image: '',
  projects: []
}


export default function ShowProjects() {
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
  const [project, setProject] = useState(initialValue);
  const { name, description, objetives,justification, country,department,district,definition, isTimeSeries, image, programs, factors } = project;
  const [open, setOpen] = React.useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = React.useState(true);
  const [loadingAso, setLoadingAso] = React.useState(false);
  const [programsBio, setProgramsBio] = React.useState([]);
  const [filteredPrograms, setFilteredPrograms] = React.useState([{ name: "" }]);
  const [isProgramsBio, setIsProgramsBio] = React.useState(false);
  const [isEmpty, setIsEmpty] = React.useState(true);
  const [programImage, setImage] = React.useState("");
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
    await getProgramsBio();
    await getFilteredPrograms();
    await getProject();
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
      `http://iq-proyecto-api.herokuapp.com/api/private/factorproject/${id}`,
      config
    );
    let factorsExport = {};
    const factors = response.data.factors;
    for (const factor in factors){
      delete factors[factor]._id;
      delete factors[factor].__v;
      delete factors[factor].projectID;
      factorsExport[`factor${factor}`] = Object.entries(factors[factor]);
    }
    return factorsExport;
  }

  function beautifyPrograms(){
    let programsExport = {};
    for (const program in programsBio) {
      delete programsBio[program]._id;
      delete programsBio[program].__v;
      delete programsBio[program].projects;
      programsExport[`program${program}`] = Object.entries(programsBio[program]);
    }
    return programsExport;
  }

  async function beautifyCSV(projectP){

    const factors = await beautifyFactors();
    const programs = beautifyPrograms();
    let toExport = {
      id: projectP.id,
      name: projectP.name,
      description: projectP.description,
      objetives: projectP.objetives,
      justification: projectP.justification,
      country: projectP.country,
      department: projectP.department,
      district: projectP.district,
      definition: projectP.definition,
      isTimeSeries: projectP.isTimeSeries,
    }
    toExport = Object.assign(toExport,programs);
    toExport = Object.assign(toExport,factors);
    setExport([toExport]);
  }

  const getProject = async () => {
    try {
      
      let response = await axios.get(`http://iq-proyecto-api.herokuapp.com/api/private/project/${id}`, config);
      setProject(response.data.project);
      let data = response.data.project;
      
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

  const getProgramsBio = async () => {
    try {
      let response = await axios.get(`http://iq-proyecto-api.herokuapp.com/api/private/programproject/${id}`, config);
      setProgramsBio(response.data.programs);
      setLoading(false);
      if (response.data.programs.length > 0)
        setIsProgramsBio(true);
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

  const getFilteredPrograms = async () => {
    try {
      let response = await axios.get(`http://iq-proyecto-api.herokuapp.com/api/private/filteredprogram/${id}`, config);
      setFilteredPrograms(response.data.programs);
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

  const getPictureProgram = async (program) => {
    try {
      if (program) {
        let response = await axios.get(`http://iq-proyecto-api.herokuapp.com/api/private/programPicture/${program.id}`, config);
        setImage(response.data.program.image);
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
    if ('objetivesProgram' in fieldValues)
      temp.objetivesProgram = fieldValues.objetivesProgram ? "" : "Este campo es obligatorio."
    if ('definitionProgram' in fieldValues)
      temp.definitionProgram = fieldValues.definitionProgram ? "" : "Este campo es obligatorio."
    setErrors({
      ...temp
    })

    if (fieldValues === values)
      return Object.values(temp).every(x => x === "")
  }

  const addNewProgram = async () => {
    try {
      setLoadingAso(true);
      values.projects.push(id);
      return await axios.post(`http://iq-proyecto-api.herokuapp.com/api/private/program/`, values, config);
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

  const updateProgram = async () => {
    try {
      setLoadingAso(true);
      programValue.projects.push(id);
      return await axios.patch(`http://iq-proyecto-api.herokuapp.com/api/private/program/${programValue.id}`, programValue, config);
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

  const updateProject = async (program) => {
    try {
      setLoadingAso(true);
      project.programs.push(program._id);
      axios.patch(`http://iq-proyecto-api.herokuapp.com/api/private/project/${id}`, project, config);
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

  const associateProgram = async () => {
    await updateProgram().then(setLoadingAso(false));
    await updateProject(programValue).then(setLoadingAso(false));
    await getFilteredPrograms();
    await getProgramsBio();
    setProgramValue(filteredPrograms[0]);
    setInputValue('');
    setIsEmpty(true);
    confirmPost();
  }

  const wrapProgram = async (program) => {
    await updateProject(program).then(setLoadingAso(false));
    await getFilteredPrograms();
    await getProgramsBio();
    confirmPost();
  }



  const {
    values,
    setValues,
    errors,
    setErrors,
    handleInputChange,
    resetForm
  } = useForm(initialProgramValues, true, validate);

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
      addNewProgram().then((response) => {
        setLoadingAso(false);
        setValues(cleanProgram);
        wrapProgram(response.data.Program);
      });

    }
  }

  const [programValue, setProgramValue] = React.useState(filteredPrograms[0]);
  const [inputValue, setInputValue] = React.useState('');

  function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
  }

  return (

    <div className={classes.root}>

      <div className={classes.programholder} hidden={!loading} style={{ width: "90%" }}>
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
            {error ? "Error!" : "Se ha asociado el programa!"}
          </Alert>
        </Snackbar>
      </div>

      <Grid item>
        <Controls.Button variant="text" text="Información de programas" className={classes.textLeft} href="#programas" />
        <Controls.Button variant="text" text="Asociar programa" className={classes.textLeft} href="#asociar" />
      </Grid>
      <Grid
        container
        direction="row"
      >
        <Tooltip title="Exportar proyecto">
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
        title="Información detallada sobre un proyecto"
        subTitle="Se mostrará también los programas y factores asociados"
        icon={<InfoIcon fontSize="large"
        />}
      />
      <br id="programas" />
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
              Nombre: {name ? name : 'Nombre'}
            </Typography>
            <Typography variant="subtitle1" color="textSecondary" component="p">
              Descripción: {description ? description : 'Descripción'}
            </Typography>
            <Typography variant="subtitle1" color="textSecondary" component="p">
              Objetivos: {objetives ? objetives: 'Sin objetivos'}
            </Typography>
            <Typography variant="subtitle1" color="textSecondary" component="p">
              Justificación: {justification ? justification: 'Sin justificación'}
            </Typography>
            <Typography variant="subtitle1" color="textSecondary" component="p">
              País: {country ? country: 'País no ingresado.'}
            </Typography>
            <Typography variant="subtitle1" color="textSecondary" component="p">
              Departamento: {department ? department: 'Departamento no ingresado.'}
            </Typography>
            <Typography variant="subtitle1" color="textSecondary" component="p">
              Distrito: {district ? district: 'Distrito no ingresado.'}
            </Typography>
            <Typography variant="subtitle1" color="textSecondary" component="p">
              Definición general: {definition ? definition: 'Definición general no ingresada.'}
            </Typography>
            
          </CardContent>

          <CardActions disableSpacing>
            <Typography variant="subtitle1" color="textSecondary" component="p">
              ¿Proyecto activo?
            </Typography>
            <Controls.Checkbox
              name="isTimeSeries"
              label=""
              value={isTimeSeries}
              disabled={true}
            />
          </CardActions>
        </Card>
      </Grid>
      <br />
      <PageHeader
        title="Programas asociados al proyecto"
        subTitle="Se muestran todos los programas asociados a este proyecto"
        icon={<ProgramIcon fontSize="large"

        />}
      />

      <div className={classes.root}>
        <div hidden={!isProgramsBio}>
          <CssBaseline />
          <div className={classes.programholder} hidden={!loading}>
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
                    <TableCell>Objetivos</TableCell>
                    <TableCell>Definición principal</TableCell>
                    <TableCell className={classes.programholder}>Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {programsBio.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((program) => (
                    <TableRow hover className={classes.row} key={program.id}>
                      <TableCell>{program.name}</TableCell>
                      <TableCell>{program.objetivesProgram}</TableCell>
                      <TableCell>{program.definitionProgram}</TableCell>
                      <TableCell>
                        <Grid
                          container
                          direction="row"
                          justifyContent="center"
                          alignItems="center"
                        >
                          <Tooltip title="Información">
                            <Button className={classes.button} variant="contained" style={{ marginRight: 10 }} component={Link} to={`/program/show/${program._id}`}>
                              <InfoIcon />
                            </Button>
                          </Tooltip>
                          <Tooltip title="Graficar datos">
                            <Button color="secondary" variant="contained" style={{ marginRight: 10 }} component={Link} to={`/graphics/${id}/${program._id}`}>
                              <BarChartIcon />
                            </Button>
                          </Tooltip>
                          <Tooltip title="Mostrar datos">
                            <Button color="inherit" variant="contained" style={{ marginRight: 10 }} component={Link} to={`/data/show/${id}/${program._id}`}>
                              <VisibilityIcon />
                            </Button>
                          </Tooltip>
                          <Tooltip title="Agregar datos">
                            <Button color="primary" variant="contained" style={{ marginRight: 10 }} component={Link} to={`/data/add/${id}/${program._id}`}>
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
              count={programsBio.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Paper>
        </div>
        <div className={classes.programholder} hidden={isProgramsBio}>
          <br />
          <Typography variant="subtitle1" color="textSecondary" component="p">
            No hay nada qué mostrar en está sección
          </Typography>
        </div>
      </div>
      <br id="asociar" />
      <br />
      <PageHeader
        title="Asociar programa a proyecto"
        subTitle="Seleccione un programa para asociarlo a este proyecto"
        icon={<InfoIcon fontSize="large"
        />}
      />
      <div className={classes.programholder} hidden={!loadingAso}>
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
            value={programValue}
            onChange={(event, newValue) => {
              getPictureProgram(newValue);
              setProgramValue(newValue);

            }}
            className={classes.center}
            id="combo-box-programs"
            options={filteredPrograms}
            getOptionLabel={(option) => option.name}
            style={{ width: 300 }}
            renderInput={(params) => <TextField {...params} label="Programas" variant="outlined" />}
            disabled={loadingAso}
            inputValue={inputValue}
            onInputChange={(event, newInputValue) => {
              setInputValue(newInputValue);
              if (newInputValue === '') {
                setIsEmpty(true);
                setProgramValue('');
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
                Agregar programa
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
                  name="objetivesProgram"
                  label="Objetivos"
                  value={values.objetivesProgram}
                  onChange={handleInputChange}
                  error={errors.name}
                />
                <Controls.Input
                  label="Definición principal"
                  name="definitionProgram"
                  value={values.definitionProgram}
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
                image={programImage ? programImage : defaultImg}
                title=""
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="h2">
                  {programValue ? programValue.name : ''}
                </Typography>
                <Typography variant="subtitle1" color="textSecondary" component="p">
                  {programValue ? programValue.description : ''}
                </Typography>
              </CardContent>

              <CardActions>
                <Typography variant="subtitle1" color="primary" component="p">
                  <span >Objetivos: </span>
                  {programValue ? programValue.objetivesProgram : ''}
                </Typography>
                <Typography variant="subtitle1" color="primary" component="p">
                  <span>Definición principal: </span>
                  {programValue ? programValue.definitionProgram : ''}
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
              text="Asociar programa"
              color="primary"
              onClick={associateProgram} />
          </Grid>
        </div>
      </Paper>

      <br />
      <br />
      <div className={classes.programholder} hidden={!loadingAso}>
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
