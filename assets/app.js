/*
 * Welcome to your app's main JavaScript file!
 *
 * We recommend including the built version of this JavaScript file
 * (and its CSS file) in your base layout (base.html.twig).
 */
//Les imports importants
import React, { useState } from "react";
import ReactDom from "react-dom";
import { HashRouter, Route, Switch, withRouter } from "react-router-dom";
import Navbar from "./components/Navbar";
import PrivateRoute from "./components/PrivateRoute";
import AuthContext from "./contexts/AuthContext";
import CustomersPage from "./pages/CustomersPage";
import HomePage from "./pages/HomePage";
import InvoicesPage from "./pages/InvoicesPage";
import LoginPage from "./pages/LoginPage";
import AuthAPI from "./services/authAPI";
// any CSS you import will output into a single css file (app.css in this case)
import './styles/app.css';



// start the Stimulus application
//import './bootstrap';

console.log("hello world !!");

AuthAPI.setup();

const App = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(AuthAPI.isAuthenticated());

    const NavbarWithRouter = withRouter(Navbar);
    
    return (
        <AuthContext.Provider value={{
            isAuthenticated,
            setIsAuthenticated
        }}>
            <HashRouter>
                <NavbarWithRouter />
                
                <main className="container pt-5">
                    <Switch>
                        <Route 
                            path="/login" 
                            component={LoginPage}
                        />
                        <PrivateRoute 
                            path="/invoices" 
                            component={InvoicesPage} 
                        />
                        
                        <PrivateRoute 
                            path="/customers"  
                            component={CustomersPage} 
                        />

                        <Route path="/" component={HomePage} />
                    </Switch>
                </main>
            </HashRouter>
        </AuthContext.Provider>
    )
};

const rootElement = document.querySelector('#app');
ReactDom.render(<App />, rootElement);

