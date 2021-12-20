import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./Register.css";
import { useHistory } from "react-router-dom";
import Controls from "../../components/controls/Controls";
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import React from 'react'
import CircularProgress from '@material-ui/core/CircularProgress';
import Fade from '@material-ui/core/Fade';
import { makeStyles } from '@material-ui/core/styles';
import Alert from '@material-ui/lab/Alert';
import IconButton from '@material-ui/core/IconButton';
import Collapse from '@material-ui/core/Collapse';
import CloseIcon from '@material-ui/icons/Close';

const AssignRole = ({ }) => {
    const history = useHistory();
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = useState("");
    const [bioprocesses, setBioprocesses] = React.useState([{ name: "" }]);
    const [users, setUsers] = React.useState([{ username: " " }]);
    const [selectedUser, setSelectedUser] = React.useState(false);
    const [selectedBioprocess, setSelectedBioprocess] = React.useState(false);
    const [roleType, setRole] = useState("investigador");
    const [open, setOpen] = React.useState(false);
    const [inputUser, setInputUser] = React.useState('');
    const [inputBioprocess, setInputBioprocess] = React.useState('');
    const config = {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
    };
    function wrapUsers(users) {

        setUsers(users);

        setLoading(false);
    }

    function wrapBioprocesses(bioprocesses) {
        setBioprocesses(bioprocesses);
        setLoading(false);
        setSelectedUser(true);

    }

    function cleanForm() {
        setSelectedBioprocess(false);
        setRole("investigador");
        setInputBioprocess("");
        
    }

    async function getBio(userValue) {
        try {
            setLoading(true);
            setSelectedUser(false);
            const bioprocesses = await axios.get(
                `https://iq-proyecto-api.herokuapp.com/api/private/filteredbioprocess/${userValue.id}`,
                config
            );
            wrapBioprocesses(bioprocesses.data.bioprocesses);


        } catch (error) {
            setTimeout(() => {
                setError("");
            }, 5000);
            setLoading(false);
            return setError("Authentication failed!");
        }
    }

    useEffect(() => {
        let unmounted = false;
        async function getUsers() {
            try {
                const users = await axios.get(
                    "https://iq-proyecto-api.herokuapp.com/api/private/users/",
                    config
                );
                wrapUsers(users.data.users);


            } catch (error) {
                setTimeout(() => {
                    setError("");
                }, 5000);
                setLoading(false);
                return setError("Authentication failed!");
            }
        }


        getUsers();
        return () => { unmounted = true; };
    }, []);

    const [bioprocessValue, setbioprocessValue] = React.useState(bioprocesses[0]);
    const [userValue, setuserValue] = React.useState(users[0]);

    const roleItems = [
        { id: 'investigador', title: 'Investigador' },
        { id: 'asistente', title: 'Asistente' },
    ]


    const registerHandler = async (e) => {
        e.preventDefault();
        setLoading(true);
        if (selectedUser === false || selectedBioprocess === false) {

            setTimeout(() => {
                setError("");
            }, 5000);
            setLoading(false)
            return setError("Seleccione un bioproceso");
        }


        try {
            const role = {
                bioprocessId: bioprocessValue.id,
                bioprocessName: bioprocessValue.name,
                role: roleType,
                editFactor: true,
                editData: true,
                export: true
            }
            userValue.roles.push(role);
            const { data } = await axios.patch(
                `https://iq-proyecto-api.herokuapp.com/api/private/users/${userValue.id}`,
                {
                    username: userValue.username,
                    email: userValue.email,
                    type: userValue.type,
                    roles: userValue.roles
                },
                config
            );
            await getBio(userValue);
            setLoading(false);
            setOpen(true);
            cleanForm();
            setTimeout(function () {
                setOpen(false);
            }, 6000);
        } catch (error) {
            console.log(error);
            setError(error.response.data.error);
            setTimeout(() => {
                setError("");
            }, 5000);
        }
    };

    const useStyles = makeStyles(() => ({
        placeholder: {
            height: 40,
            textAlign: 'center'
        },
    }));
    const classes = useStyles();
    return (

        <div className="register-screen">

            <form onSubmit={registerHandler} className="register-screen__form">
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

                <Collapse in={open}>
                    <Alert
                        severity={error ? "error" : "success"}
                        action={
                            <IconButton
                                aria-label="close"
                                color="inherit"
                                size="small"
                                onClick={() => {
                                    setOpen(false);
                                }}
                            >
                                <CloseIcon fontSize="inherit" />
                            </IconButton>
                        }
                    >
                        {error ? error : 'Se ha asociado el rol!'}
                    </Alert>
                </Collapse>

                <h3 className="register-screen__title">Asignar rol a usuario existente</h3>
                {error && <span className="error-message">{error}</span>}
                <br />
                <div >
                    <Autocomplete
                        value={userValue}
                        onChange={(event, newValue) => {
                            setuserValue(newValue);
                            setSelectedUser(true);
                            setSelectedBioprocess(false);
                            console.log(newValue);
                            getBio(newValue);
                        }}
                        id="combo-box-users"
                        options={users}
                        getOptionLabel={(option) => option.username}
                        style={{ width: 300 }}
                        renderInput={(params) => <TextField {...params} label="Usuarios" variant="outlined" />}
                        disabled={loading}
                        disableClearable
                        inputValue={inputUser}
                        onInputChange={(event, newInputValue) => {
                            setInputUser(newInputValue);
                        }}
                    />
                    <br />
                    <Autocomplete
                        value={bioprocessValue}
                        onChange={(event, newValue) => {
                            setbioprocessValue(newValue);
                            setSelectedBioprocess(true);
                        }}
                        id="combo-box-assign"
                        options={bioprocesses}
                        getOptionLabel={(option) => option.name}
                        style={{ width: 300 }}
                        renderInput={(params) => <TextField {...params} label="Bioprocesos" variant="outlined" />}
                        disabled={!selectedUser}
                        disableClearable
                        inputValue={inputBioprocess}
                        onInputChange={(event, newInputValue) => {
                            setInputBioprocess(newInputValue);
                        }}
                    />
                    <br />
                    <Controls.RadioGroup
                        name="role"
                        label="Tipo de rol"
                        value={roleType}
                        onChange={(e) => { setRole(e.target.value); }}
                        items={roleItems}
                    />
                </div>
                <br />
                <button type="submit" className="btn btn-primary">
                    Asignar rol
                </button>
            </form>
        </div>
    );
};

export default AssignRole;
