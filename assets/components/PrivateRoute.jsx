import React, {useContext} from 'react';
import { Redirect, Route } from "react-router-dom";
import AuthContext from '../contexts/AuthContext';

//Gestion accès des routes
const PrivateRoute = ({path, component}) => {

    const {isAuthenticated} = useContext(AuthContext);
        
    return isAuthenticated ? ( 
            <Route path={path} component={component} />
        ) : (
            <Redirect to="/login" />
        );
};

export default PrivateRoute;