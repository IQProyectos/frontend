import React, { useState, useEffect } from 'react'
import { Grid } from '@material-ui/core';
import Controls from "../../components/controls/Controls";
import { useForm, Form } from '../../components/useForm';
import { Paper, makeStyles, Box } from '@material-ui/core';
import EcoIcon from '@material-ui/icons/Eco';
import PageHeader from "../../components/PageHeader";
import { useParams } from 'react-router-dom';
import AlertMessage from '../../components/AlertMessage';
import axios from 'axios';
import CircularStatic from '../../components/CircularStatic'
import ImageComponent from '../../components/ImageComponent';

const initialValues = {
    name: '',
    entrada: '',
    image: '',
    projects: []
}

const useStyles = makeStyles(theme => ({
    pageContent: {
        margin: '50px 0 0 0',
        width: '90%',
        padding: theme.spacing(3)
    },
    blogholder: {
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

export default function BlogForm() {
    const { id } = useParams();
    const classes = useStyles();
    const [loading, setLoading] = React.useState(false);
    const [open, setOpen] = React.useState(false);
    const [error, setError] = useState('');
    const message = id ? "Se ha actualizado el blog!" : "Se ha guardado el blog!"
    const title = id ? "Actualizar Blog" : "Añadir nuevo Blog";
    const description = id ? "Formulario para actualizar Blog" : "Formulario para añadir Blog";
    const [progress, setProgress] = useState(0);
    const validate = (fieldValues = values) => {
        let temp = { ...errors }
        if ('name' in fieldValues)
            temp.name = fieldValues.name ? "" : "Este campo es obligatorio."
        if ('entrada' in fieldValues)
            temp.entrada = fieldValues.entrada ? "" : "Este campo es obligatorio."
        setErrors({
            ...temp
        })

        if (fieldValues === values)
            return Object.values(temp).every(x => x === "")
    }

    useEffect(() => {
        let unmounted = false;
        if (id)
            getBlog();
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

    const getBlog = async () => {
        setLoading(true);
        try {
            let response = await axios.get(`https://iq-proyecto-api.herokuapp.com/api/private/blog/${id}`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("authToken")}`,
                },
                onDownloadProgress: (data) => {
                    //Set the progress value to show the progress bar                    
                    setProgress(Math.round((100 * data.loaded) / data.total));
                },
            });
            setValues(response.data.blog);
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
    } = useForm(initialValues, true, validate);

    const confirmPost = () => {
        setOpen(true);
        setLoading(false);
        if (!id) {
            console.log("create");
            resetForm({});
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
                if (id) {
                    await axios
                        .patch(`https://iq-proyecto-api.herokuapp.com/api/private/blog/${id}`, values, config)
                        .then(confirmPost)
                } else {
                    await axios
                        .post("https://iq-proyecto-api.herokuapp.com/api/private/blog/", values, config)
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
                subTitle={description}
                icon={<EcoIcon fontSize="large" color='primary'
                />}
            />
            <CircularStatic progress={progress} hidden={!loading} />
            <Paper className={classes.pageContent}>
            <ImageComponent initialValues={values} onChange={handleInputChange}/>
                <Form onSubmit={handleSubmit}>
                    <AlertMessage errorMessage={error} successMessage={message} openMessage={open} />
                    <Grid container
                        direction="row"
                        justifyContent="center"
                        alignItems="center"
                        style={{ textAlign: 'center' }}>
                        <Grid item xs={6}>
                            <Controls.Input
                                name="name"
                                label="Nombre del blog"
                                value={values.name}
                                onChange={handleInputChange}
                                error={errors.name}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <Controls.Input
                                name="entrada"
                                label="Entrada del blog"
                                value={values.entrada}
                                onChange={handleInputChange}
                                error={errors.entrada}
                            />
                        </Grid>

                        <Grid
                            container
                            direction="row"
                            justifyContent="center"
                            alignItems="center"
                            style={{ marginTop: '20px' }}
                        >

                            <Controls.Button
                                type="submit"
                                text="Guardar"
                            />
                            <Controls.Button
                                text="Limpiar"
                                color="default"
                                onClick={resetForm} />
                        </Grid>
                    </Grid>
                </Form>
            </Paper>
        </div>
    )
}
