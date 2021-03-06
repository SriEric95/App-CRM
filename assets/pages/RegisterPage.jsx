import Axios from 'axios';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Field from '../components/forms/fields';
import axios from 'axios';
import UsersAPI from '../services/usersAPI';

const  RegisterPage = ({history}) => {
    const [user, setUser] = useState({
        firstName: "",
        lastName:"",
        email:"",
        password:"",
        passwordConfirm: ""
    });

    const [errors, setErrors] = useState({
        firstName: "",
        lastName:"",
        email:"",
        password:""
    });

    //Gestion des changements des inputs dans le formulaire
    //Destructuré event => currentTarget
    const handleChange=({currentTarget}) => {
        const {name, value} = currentTarget;
        setUser({ ...user, [name]:value });
    };

    //Gestion de la soumission
    const handleSubmit= async event => {
        event.preventDefault();

        const apiErrors = {};
        if(user.password !== user.passwordConfirm){
            apiErrors.passwordConfirm ="Votre mot de passe ne correspond pas au mot de passe original";
            setErrors(apiErrors);
            return;
        }

        try{
            await UsersAPI.register(user);
            setErrors({});

            //TODO : Flash success
            history.replace('/login');
            console.log(response);
        }catch(error){
            const { violations } = error.response.data;

            if(violations){
                violations.forEach(violation => {
                    apiErrors[violation.propertyPath] = violation.message
                });
                setErrors(apiErrors);
            }

            //TODO : Flash erreur
        }
    }

    return ( <>
        <h1>Inscription</h1>
        <form onSubmit={handleSubmit}>
            <Field name="firstName" label="Prénom" placeholder="Votre prénom" error={errors.firstName} value=
            {user.firstName} onChange={handleChange}/>
            <Field name="lastName" label="Nom de famille" placeholder="Votre nom de famille" error={errors.lastName} value=
            {user.lastName} onChange={handleChange}/>
            <Field name="email" label="Email" type="email" placeholder="Votre email" error={errors.email} value=
            {user.email} onChange={handleChange}/>
            <Field name="password" label="Mot de passe" type="password" placeholder="Votre mot de passe" error={errors.password} value=
            {user.password} onChange={handleChange}/>
            <Field name="passwordConfirm" label="Confirmation de mot de passe" type="password" placeholder="Confirmez votre mot de passe" error={errors.passwordConfirm} value=
            {user.passwordConfirm} onChange={handleChange}/>

            <div className="form-group">
                <button type="submit" className="btn btn-success">Inscription</button>
                <Link to="/login" className="btn btn-link">J'ai déjà un compte</Link>
            </div>
        </form>
    </> );
}
 
export default  RegisterPage;