import moment from "moment";
import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import Pagination from '../components/Pagination';
import { default as InvoiceAPI, default as invoicesAPI } from "../services/InvoicesAPI";

const STATUS_CLASSES = {
    PAID: "success",
    SENT: "primary",
    CANCELLED: "danger"
}

const STATUS_LABELS = {
    PAID: "Payée",
    SENT: "Envoyée",
    CANCELLED: "Annulée"
}

const InvoicesPage = (props) => {
    
    const [invoices, setinvoices] = useState([]);
    //Par défaut currentPage est la page 1
    const [currentPage, setCurrentPage] = useState(1);
    
    //Par défaut vide
    const [search,setSearch] = useState("");
    const itemsPerPage =10;

    // Récupération des invoices auprès de l'API
    const fetchInvoices = async ()=> {
        try{
            const data = await InvoiceAPI.findAll();
            setinvoices(data);
        }
        catch(error)
        {
            console.log(error.response);
        }
        
    }

    //Charger les invoices au chargement du composant
    useEffect(() => {
        fetchInvoices();
    },[]);

    //Gestion du changement de page
    const handlePageChange = page => setCurrentPage(page);
    
    //Gestionde la recherche
    const handleSearch = event => {
        const value = event.currentTarget.value;
        setSearch(value);
        setCurrentPage(1);
    }

    //Gestion de la suppression
    const handleDelete = async id => {
        const originalInvoices = [...invoices];

        //Pour chaque invoice regarder si l'id est diff de l'id qu'on veut supprimer
        setinvoices(invoices.filter(invoice => invoice.id !==id));

        try{
            await invoicesAPI.delete(id);
        }
        catch(error)
        {
            console.log(error);
            setinvoices(originalInvoices);
        }
    }

    //Gestion du format de date
    const formatDate = (str) => moment(str).format('DD/MM/YYYY');

    //Gestion de la recherche
    //Filtrage des Invoices en fonction de la recherche
    const filteredInvoices = invoices.filter(
        i =>
            i.customer.lastName.toLowerCase().includes(search.toLowerCase()) 
            ||
            i.customer.firstName.toLowerCase().includes(search.toLocaleLowerCase())
            ||
            i.amount.toString().startsWith(search.toLocaleLowerCase())
            ||
            STATUS_LABELS[i.status].toLowerCase().includes(search.toLowerCase())
    );

    //Pagination des données
    const paginatedInvoices = Pagination.getData(filteredInvoices, currentPage, itemsPerPage);

    return (
        <>
        <div className="d-flex justify-content-between align-items-center">
            <h1>Liste des factures</h1>
            <Link className="btn btn-primary" to="/invoices/new">Créer une facture</Link>
        </div>
            

            <div className="form-group">
                <input type="text" onChange={handleSearch} value={search} className="form-control" placeholder="Rechercher" />
            </div>

            <table className="table table-hover">
                <thead>
                    <tr>
                        <th>Numéro</th>
                        <th>Client</th>
                        <th className="text-center">Date d'envoi</th>
                        <th className="text-center">Statut</th>
                        <th className="text-center">Montant</th>
                        <th></th>
                    </tr>
                </thead>

                <tbody>
                    {paginatedInvoices.map(invoice => 
                    <tr key={invoice.id}>
                        <td>{invoice.chrono}</td>
                        <td>
                            <a href="#">{invoice.customer.firstName} {invoice.customer.lastName}</a> 
                        </td>
                        <td className="text-center">{formatDate(invoice.sentAt)}</td>
                        <td className="text-center">
                            <span 
                                // className={"badge badge-" + STATUS_CLASSES[invoice.status]}
                            >
                                {STATUS_LABELS[invoice.status]}
                            </span>
                        </td>
                        <td className="text-center">{invoice.amount.toLocaleString()} €</td>
                        <td>
                            <Link to={"/invoices/" + invoice.id} className="btn btn-sm btn-primary mr-1">Editer</Link>
                            <button className="btn btn-sm btn-danger" onClick={() => handleDelete(invoice.id)}>Supprimer</button>
                        </td>
                    </tr>)}
                    
                </tbody>

            </table>

            <Pagination currentPage={currentPage} itemsPerPage={itemsPerPage} onPageChanged={handlePageChange}
            length={filteredInvoices.length}/>
        </>
    
    );
}
 
export default InvoicesPage;