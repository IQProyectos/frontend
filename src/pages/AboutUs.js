import React from 'react'
import Grid from "@material-ui/core/Grid";
import logo from "../assets/img/logo.png";
import Controls from "../components/controls/Controls";
import {useHistory} from 'react-router-dom';

export default function AboutUs() {
    const history = useHistory();
    const handleGoBack = () => {
        history.push("/");
      };
    return (
        <div>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                <Controls.Button
              variant="contained"
              onClick={handleGoBack}
              style={{
                borderRadius: 0,
                marginLeft: 0,
                marginRight: 0,
                paddingLeft: 0,
                paddingRight: 0,
              }}
              text="Atrás"
            />
                </Grid>
                <Grid item xs={6}>
                    <h1>Acerca del equipo:</h1>
                    <br/>
                    <h2>Desarrolladores:</h2>
                    <p>Erick Elizondo Ramirez</p>
                    <p>Mauricio Gamboa Godinez</p>
                    <p>Daniel Macías Reynaud</p>
                    <br/>
                    <h2>Diseñadora:</h2>
                    <p>Karina Perez Gonzalez</p>
                </Grid>
                <Grid item xs={6}>
                <img className="login-image" src={logo}></img>
                </Grid>
                
            </Grid>
            
            
        </div>
    )
}
