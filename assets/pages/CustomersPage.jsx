import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Pagination from '../components/Pagination';
import CustomersAPI from "../services/customersAPI";


const CustomersPage = props => {

    //state avec l'info et fonction pour modifier l'info

    //Par défaut customers contient un tableau vide
    const [customers,setCustomers] = useState([]);

    //Par défaut currentPage est la page 1
    const [currentPage, setCurrentPage] = useState(1);

    const [search,setSearch] = useState('');

    //Permet d'aller récupérer les customers
    const fetchCustomer = async () => {
        try {
            const data = await CustomersAPI.findAll()
            setCustomers(data);
        } catch(error) {
            console.log(error.response)
        }
    }

    // Au chargement du composant, on va chercher les customers
    useEffect(() => {fetchCustomer()},[]);

    //Gestion de la suppression d'un customer
    const handleDelete = async id =>{

        const originalCustomers = [...customers];

        //1. L'approche optimiste
        setCustomers(customers.filter(customer => customer.id !== id));

        //2. L'approche pessimiste
        try{
            await CustomersAPI.delete(id)
        }
        catch(error){
            setCustomers(originalCustomers);
        }

        //Deuxième façon de faire une requête (traitement de promesse)
        // CustomersAPI.delete(id)
        //     .then(response => console.log("ok"))
        //     .catch(error => {
        //         setCustomers(originalCustomers);
        //         console.log(error.response);
        //     })
    };

    //Gestion du changement de page
    const handlePageChange = page => setCurrentPage(page);
    
    //Gestionde la recherche
    const handleSearch = event => {
        const value = event.currentTarget.value;
        setSearch(value);
        setCurrentPage(1);
    }

    const itemsPerPage =10;

    //Filtrage des customers en fonction de la recherche
    const filteredCustomers = customers.filter(
        c =>
            c.firstName.toLowerCase().includes(search.toLowerCase()) 
            ||
            c.lastName.toLowerCase().includes(search.toLocaleLowerCase())
            ||
            c.email.toLowerCase().includes(search.toLowerCase())
            ||
            (c.company && c.company.toLowerCase().includes(search.toLocaleLowerCase()))
    );

    //Pagination des données
    const paginatedCustomers = Pagination.getData(filteredCustomers, currentPage, itemsPerPage);

    return (
        <>
            <div className="mb-3 d-flex justify-content-between align-items-center">
                <h1>Liste des clients</h1>
                <Link to="/customers/new" className="btn btn-primary">Créer un client</Link>
            </div>

            <div className="form-group">
                <input type="text" onChange={handleSearch} value={search} className="form-control" placeholder="Rechercher" />
            </div>

            <table className="table table-hover">
                <thead>
                    <tr>
                        <th>Id.</th>
                        <th>Client</th>
                        <th>Email</th>
                        <th>Entreprise</th>
                        <th className="text-center">Factures</th>
                        <th className="text-center">Montant total</th>
                        <th/>
                    </tr>
                </thead> 

                <tbody>
                    {paginatedCustomers.map(customer => 
                    
                    <tr key={customer.id}>
                        <td>{customer.id}</td>
                        <td>
                            <a href="#">{customer.firstName} {customer.lastName}</a>
                        </td>
                        <td>{customer.email}</td>
                        <td>{customer.company}</td>
                        <td className="text-center" >{customer.invoices.length}</td>
                        <td className="text-center">{customer.totalAmount.toLocaleString()} €</td>
                        <td>
                            <button
                                onClick={() => handleDelete(customer.id)}
                                disabled={customer.invoices.length >0} 
                                className="btn btn-sm btn-danger"
                            >
                                Supprimer
                            </button>
                        </td>
                    </tr>)}
                    
                </tbody>
            </table>
            {itemsPerPage < filteredCustomers.length && (
                <Pagination currentPage={currentPage} itemsPerPage={itemsPerPage} length={filteredCustomers.length} onPageChanged={handlePageChange} />
            )}
            
            
        </>
    );
}       
 
export default CustomersPage;