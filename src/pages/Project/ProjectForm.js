import React, { useState, useEffect } from 'react'
import { Grid, } from '@material-ui/core';
import Controls from "../../components/controls/Controls";
import { useForm, Form } from '../../components/useForm';
import { Paper, makeStyles, Box } from '@material-ui/core';
import EcoIcon from '@material-ui/icons/Eco';
import PageHeader from "../../components/PageHeader";
import CircularStatic from '../../components/CircularStatic'
import axios from 'axios';
import { useParams } from 'react-router-dom';
import AlertMessage from '../../components/AlertMessage';
import ImageComponent from '../../components/ImageComponent';


const predictionItems = [
    { id: 'regresion', title: 'Regresión lineal' },
    { id: 'clasificacion', title: 'Clasificación' },
]

const initialBValues = {
    name: '',
    description: '',
    objetives: '',
    justification: '',
    country: '',
    department: '',
    district: '',
    definition: '',
    isTimeSeries: false,
    image: '',
    programs: [],
    factors: []
}

const useStyles = makeStyles(theme => ({
    pageContent: {
        margin: '50px 0 0 0',
        width: '90%',
        padding: theme.spacing(3)
    },
    programholder: {
        height: 40,
        textAlign: 'center',
        width: '90%'
    },
    sizeAvatar: {
        height: "150px",
        width: "150px",
        marginBottom: "25px",
    },
    imageButton: {
        marginBottom: "25px"
    },
}))

export default function ProjectForm() {
    const { id } = useParams();
    const classes = useStyles();
    const [loading, setLoading] = React.useState(false);
    const [open, setOpen] = React.useState(false);
    const [error, setError] = useState('');
    const [progress, setProgress] = useState(0);
    const message = id ? "Se ha actualizado el proyecto!" : "Se ha guardado el proyecto!"
    const title = id ? "Actualizar proyecto" : "Añadir nuevo proyecto";
    const type = id ? "actualizar" : "agregar";
    const validate = (fieldValues = values) => {
        let temp = { ...errors }        
        if ('name' in fieldValues)
            temp.name = fieldValues.name ? "" : "Este campo es obligatorio."
        if ('description' in fieldValues)
            temp.description = fieldValues.description ? "" : "Este campo es obligatorio."
        if ('objetives' in fieldValues)
            temp.objetives = fieldValues.objetives ? "" : "Este campo es obligatorio."
        if ('justification' in fieldValues)
            temp.justification = fieldValues.justification ? "" : "Este campo es obligatorio."
        if ('country' in fieldValues)
            temp.country = fieldValues.country ? "" : "Este campo es obligatorio."
        if ('department' in fieldValues)
            temp.department = fieldValues.department ? "" : "Este campo es obligatorio."
        if ('district' in fieldValues)
            temp.district = fieldValues.district ? "" : "Este campo es obligatorio." 
        if ('definition' in fieldValues)
            temp.definition = fieldValues.definition ? "" : "Este campo es obligatorio."    
            
            
        setErrors({
            ...temp
        })        
        if (fieldValues === values)
            return Object.values(temp).every(x => x === "")
    }

    useEffect(() => {
        let unmounted = false;
        if (id)
            getProject();
        return () => { unmounted = true; };
    }, []);

    const config = {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        }, onUploadProgress: (data) => {
            //Set the progress value to show the progress bar
            setProgress(Math.round((100 * data.loaded) / data.total));
        },
    };
    const getProject = async () => {
        setLoading(true);
        try {
            let response = await axios.get(`http://localhost:5000/api/private/project/${id}`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("authToken")}`,
                },
                onDownloadProgress: (data) => {
                    //Set the progress value to show the progress bar                    
                    setProgress(Math.round((100 * data.loaded) / data.total));
                },
            });
            setValues(response.data.project);
            setLoading(false);
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
    }

    const {
        values,
        setValues,
        errors,
        setErrors,
        handleInputChange,
        resetForm
    } = useForm(initialBValues, true, validate);

    const confirmPost = () => {
        setOpen(true);
        setLoading(false);
        if(!id){
            resetForm({
            })
        }
        setTimeout(function () {
            setOpen(false);
        }, 6000);

    }
    const handleSubmit = async e => {
        e.preventDefault()
        if (validate()) {
            setLoading(true);
            try {
                console.log(values);
                if (id) {
                    await axios
                        .patch(`http://localhost:5000/api/private/project/${id}`, values, config)
                        .then(confirmPost)
                } else {
                    await axios
                        .post("http://localhost:5000/api/private/project/", values, config)
                        .then(confirmPost)
                }
            }

            catch (error) {
                setLoading(false);
                setTimeout(() => {
                    setTimeout(() => {
                        setError("");
                    }, 2000);
                }, 5000);
                return setError("Authentication failed!");
            }

        }
    }
    return (
        <div>
            <PageHeader
                title={title}
                subTitle={`Formulario para ${type} un proyecto`}
                icon={<EcoIcon fontSize="large" color='primary'
                />}
            />
            <CircularStatic progress={progress} hidden={!loading} />
            <Paper className={classes.pageContent}>                
                <ImageComponent initialValues={values} onChange={handleInputChange}/>
                <Form onSubmit={handleSubmit}>
                    <AlertMessage errorMessage={error} successMessage={message} openMessage={open}/>
                    <Grid container>
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
                            <Controls.Input
                                label="Objetivos"
                                name="objetives"
                                value={values.objetives}
                                onChange={handleInputChange}
                                error={errors.objetives}
                            />

                            <Controls.Input
                                label="Justificación"
                                name="justification"
                                value={values.justification}
                                onChange={handleInputChange}
                                error={errors.justification}
                            />
                            <Controls.Input
                                label="País"
                                name="country"
                                value={values.country}
                                onChange={handleInputChange}
                                error={errors.country}
                            />

                            <Controls.Input
                                label="Departamento"
                                name="department"
                                value={values.department}
                                onChange={handleInputChange}
                                error={errors.department}
                            />

                            <Controls.Input
                                label="Distrito"
                                name="district"
                                value={values.district}
                                onChange={handleInputChange}
                                error={errors.district}
                            />
                            <Controls.Input
                                label="Definición general"
                                name="definition"
                                value={values.definition}
                                onChange={handleInputChange}
                                error={errors.definition}
                            />


                        </Grid>
                        <Grid item xs={6}>
                            <Controls.Checkbox
                                name="isTimeSeries"
                                label="Activar proyecto"
                                value={values.isTimeSeries}
                                onChange={handleInputChange}
                                title="Se presentará como proyecto activo al marcar la casilla, de lo contrario se presentará como proyecto inactivo."
                            />
                            
                        </Grid>
                        <Grid
                            container
                            direction="row"
                            justifyContent="center"
                            alignItems="center"
                            style={{ marginTop: '20px' }}
                        >
                            <div>
                                <Controls.Button
                                    type="submit"
                                    text="Guardar"
                                />

                                <Controls.Button
                                    text="Limpiar"
                                    color="inherit"
                                    onClick={resetForm} />
                            </div>
                        </Grid>
                    </Grid>
                </Form>
            </Paper>
        </div>
    )
}
