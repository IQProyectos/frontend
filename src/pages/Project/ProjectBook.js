import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { CalendlyEventListener, InlineWidget } from "react-calendly";
import CalendarTemplate from './Calendar';
 

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



export default function ProjectBook() {

  const [availability, setAvailability] = useState([])
  const Calendar = CalendarTemplate({
    availability,
    setAvailability: update => {
      setAvailability(update)
      printAvailability(update)
      console.log("CRAYOLA")
      console.log(availability)
    },
   

  
});
  

  function printAvailability(update){
    console.log("OLIS")
    console.log(update)
  }


  return (
    <div>
      <Calendar />
    </div>
  );
}
