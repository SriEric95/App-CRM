import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Field from '../components/forms/fields';
import CustomersAPI from "../services/customersAPI";
import customersAPI from '../services/customersAPI';

//Destructuration de props => match, history
const CustomerPage = ({match, history}) => {
    const {id = "new"} = match.params;

    if(id !== "new"){
        console.log(id);
    }

    // console.log(props);

    //State
    const [customer, setCustomer] = useState({
        lastName: "",
        firstName:"",
        email:"",
        company:""
    });

    const [errors, setErrors] =useState({
        lastName: "",
        firstName:"",
        email:"",
        company:""
    })

    //Etat "modifié" à faux par défaut
    const [editing, setEditing]=useState(false);

    //Récupération du customer en fonction de l'identifiant
    const fetchCustomer = async id => {
        try
        {
            const { firstName, lastName, email, company } = CustomersAPI.find(id);
            setCustomer({firstName, lastName, email, company});
        }
        catch(error)
        {
            //TODO : Notification flash d'une erreur
            history.replace("/customers");
        }
    
            //console.log(response.data);

    }
    
    //Chargement du customer si besoin au chargement du composant ou au changement de l'identifiant
    useEffect(() => {
        if(id !== "new") {
            setEditing(true);
            fetchCustomer(id);
        }
    }, [id]);

    //Gestion des changements des inputs dans le formulaire
    //Destructuré event => currentTarget
    const handleChange=({currentTarget}) => {
        const {name, value} = currentTarget;
        setCustomer({...customer, [name]:value});
    };

    //Gestion de la soumission du formulaire
    const handleSubmit= async event => {
        event.preventDefault();

        try{
            if(editing){
                await customersAPI.update(id,customer);
             
            }
            //TODO : Flash notification de succès
            else{
                await CustomersAPI.create(customer);
                //TODO / Flash notification de succès
                //Si on ajoute un nouveau customer on change la page
                history.replace("/customers");
                
            }
            setErrors({});
        }
        
        //Destructuré error => response
        catch({response}){
            //Destructuré response.data => violations
            const {violations} = response.data;
            if(violations){
                const apiErrors = {};
                violations.forEach(({propertyPath, message}) => {
                    apiErrors[propertyPath] = message;
                });
                setErrors(apiErrors);
                //TODO : Flash notification d'erreurs
            }  
        }
    }

    return (
            <>
                {(!editing && <h1>Création d'un client</h1>) || (<h1> Modification d'un client</h1>) }
                <form onSubmit={handleSubmit}>
                    <Field name="lastName" label="Nom de famille" placeholder="Nom de famille" value={customer.lastName} onChange={handleChange} error={errors.lastName} />
                    <Field name="firstName" label="Prénom" placeholder="Prénom du client" value={customer.firstName} onChange={handleChange} error={errors.firstName}/>
                    <Field name="email" label="Email" placeholder="Adresse email du client" type="email" value={customer.email} onChange={handleChange} error={errors.email}/>
                    <Field name="company" label="Entreprise" placeholder="Entreprise du client" value={customer.company} onChange={handleChange} error={errors.company}/>
                    <br></br>
                    <div className="form-group">
                        <button type="submit" className="btn btn-success">
                            Enregistrer
                        </button>
                        <Link to="/customers" className="btn btn-link">Retour à la liste</Link>
                    </div>
                </form>
            </>
    );
    }
 
export default CustomerPage;