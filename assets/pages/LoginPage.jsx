import React, { useState, useContext } from 'react';
import AuthContext from '../contexts/AuthContext';
import AuthAPI from '../services/authAPI';

const LoginPage = ({history}) => {

    const { setIsAuthenticated } = useContext(AuthContext)

    const [credentials, setCredentials] =useState({
        username: "",
        password: ""
    });

    const [error, setError] = useState("");

    //Gestion des champs
    const handleChange = ({currentTarget}) => {

        //2e méthode
        const{value, name} = currentTarget;

        //1er methode
        //Prendre la valeur de l'input
        // const value = currentTarget.value;

        // //Prender le name de l'input
        // const name =currentTarget.name;

        //Ecraser la valeur de départ
        setCredentials({...credentials, [name]:value});
    }

    //Gestion du submit
    const handleSubmit = async event => {
        event.preventDefault();

        try{
            await AuthAPI.authenticate(credentials);
            setError("");
            setIsAuthenticated(true);

            //Une fois connecté redirigé vers la page customers
            history.replace("/customers");
        }
        catch(error)
        {
            setError("Aucun compte ne possède cette adresse email ou alors les informations ne correpondent pas");
            console.log(error);
        }
    };

    return ( 
        <>
            <h1> Connexion à l'application</h1>

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="username">
                        Adresse email
                    </label>
                    <input  
                        value={credentials.username}
                        onChange={handleChange} 
                        type="email" 
                        placeholder="Adresse email de connexion" 
                        name="username" 
                        id="username"
                        className={"form-control" + (error && " is-invalid")} 
                    />
                    {error && <p className="invalid-feedback">{error}</p>}
                </div>
                <div className="form-group">
                    <label htmlFor="_password">
                        Mot de passe
                    </label>
                    <input 
                        value={credentials.password}
                        onChange={handleChange} 
                        type="password" 
                        placeholder="Mot de passe" 
                        name="password" 
                        id="password" 
                        className="form-control" 
                    />
                </div>
                <div className="form-group">
                    <button type="submit" className="btn btn-success">
                        Je me connecte
                    </button>
                </div>
            </form>
        </>     
    );
}
 
export default LoginPage;