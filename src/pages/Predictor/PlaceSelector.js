import React, { useState, useEffect } from "react";
import {
  Table,
  TableHead,
  TableCell,
  Paper,
  TableRow,
  TableBody,
  Button,
  makeStyles,
  CssBaseline,
  Grid,
} from "@material-ui/core";
import { Link } from "react-router-dom";
import TableContainer from "@material-ui/core/TableContainer";
import TablePagination from "@material-ui/core/TablePagination";
import Tooltip from "@mui/material/Tooltip";
import InfoIcon from "@material-ui/icons/Info";
import CheckIcon from "@mui/icons-material/Check";
import axios from "axios";
import CircularProgress from '@material-ui/core/CircularProgress';
import Fade from '@material-ui/core/Fade';
import VisibilityIcon from '@mui/icons-material/Visibility';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme) => ({
  cardContainer: {
    width: 800,
    justifyContent: "center",
    alignItems: "center",
  },
  media: {
    height: 300,
  },
  table: {
    width: "90%",
    margin: "50px 0 0 0",
  },
  thead: {
    "& > *": {
      fontSize: 20,
      background: "#8ade8f",
      color: "#FFFFFF",
    },
  },
  row: {
    "& > *": {
      fontSize: 18,
    },
  },
  buttonheader: {
    display: "flex",
  },
  placeholder: {
    height: 40,
    textAlign: "center",
  },
  button: {
    background: "#4287f5",
    color: "#FFFFFF",
  },
  pageContent: {
    width: "90%",
    margin: "50px 0 0 0",
    padding: theme.spacing(3),
  },
  center: {
    display: "flex",
    textAlign: "center",
  },
  horizmenu: {
    display: "inline-block",
  },
  textLeft: {
    marginLeft: "0",
    paddingLeft: "0",
  },
}));

export default function PlaceSelector({id, setPlace, setPlaceName}) {
  const classes = useStyles();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [placesBio, setPlacesBio] = React.useState([]);
  const [isPlacesBio, setIsPlacesBio] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const [open, setOpen] = React.useState(false);
  const [error, setError] = useState("");

  const handleParentData = (pl, plName) => {
    setPlace(pl);
    setPlaceName(plName);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  
  useEffect(() => {
    let unmounted = false;
    getPlacesBio();
    return () => { unmounted = true; };
  }, [id]);
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("authToken")}`,
    },
  };

  const getPlacesBio = async () => {
    try {
      setLoading(true);
      let response = await axios.get(
        `https://iq-proyecto-api.herokuapp.com/api/private/placebioprocess/${id}`,
        config
      );
      setPlacesBio(response.data.places);
      setLoading(false);
      if (response.data.places.length > 0) setIsPlacesBio(true);
    } catch (error) {
      setTimeout(() => {
        setOpen(false);
        setTimeout(() => {
          setError("");
        }, 2000);
      }, 5000);
      setOpen(true);
      setLoading(false);
      return setError("Authentication failed!");
    }
  };


  

  return (
    <div>
      <div className={classes.root}>
        <div hidden={!isPlacesBio}>
          <CssBaseline />
          <div className={classes.placeholder} hidden={!loading}>
            <Fade
              in={loading}
              style={{
                transitionDelay: "0m",
              }}
              unmountOnExit
            >
              <CircularProgress />
            </Fade>
            <br />
          </div>
          <Paper className={classes.table}>
            <TableContainer>
              <Table
                stickyHeader
                aria-label="sticky table"
                className={classes.container}
              >
                <TableHead>
                  <TableRow className={classes.thead}>
                    <TableCell>Nombre</TableCell>
                    <TableCell>Latitud</TableCell>
                    <TableCell>Longitud</TableCell>
                    <TableCell className={classes.placeholder}>
                      Acciones
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {placesBio
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((place) => (
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
                              <Tooltip title="Seleccionar">
                              <Button
                                color="primary"
                                variant="contained"
                                style={{ marginRight: 10 }}
                                onClick={() => handleParentData(place._id, place.name)}
                              >
                                <CheckIcon />
                              </Button>
                            </Tooltip>
                            <Tooltip title="Información">
                              <Button
                                className={classes.button}
                                variant="contained"
                                style={{ marginRight: 10 }}
                                component={Link}
                                to={`/place/show/${place._id}`}
                              >
                                <InfoIcon />
                              </Button>
                            </Tooltip>
                            <Tooltip title="Mostrar datos">
                              <Button
                                color="inherit"
                                variant="contained"
                                style={{ marginRight: 10 }}
                                component={Link}
                                to={`/data/show/${id}/${place._id}`}
                              >
                                <VisibilityIcon />
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
    </div>
  );
}
