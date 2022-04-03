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


export default function ProjectBook() {
  

  return (
    <h1>AGENDAR</h1>
   
  );
}
