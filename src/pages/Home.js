import FileManager from '../components/FileManager';
import Grid from '@material-ui/core/Grid'
import React from 'react'

const Home = ({ history }) => {    
    return (
        <div>
            <Grid
                container
                direction="row"
                justifyContent="center"
                alignItems="center"
            >
                <h1>Gestor de proyectos de investigación</h1>
            </Grid>
            <Grid
                container
                direction="row"
                justifyContent="center"
                alignItems="center"
            >
                <h2>Prototipo: Sprint 1</h2>
            </Grid>
        </div>
    )
}

export default Home;