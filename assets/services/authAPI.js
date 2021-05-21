import axios from "axios";
import jwtDecode from "jwt-decode";

/**
 * Déconnection (suppression du token du localStorage et sure Axios)
 */
function logout(){
    window.localStorage.removeItem("authToken");
    delete axios.defaults.headers["Authorization"];
}

/**
 * Requête HTTP d'authentification et stockage du token dans le storage et sur Axios
 * @param {object} credentials 
 * @returns 
 */
function authenticate(credentials){
    return axios
        .post("http://localhost:8000/api/login_check", credentials)
        .then(response => response.data.token)
        .then(token => {
            
            // Je stocke le token dans mon localStorage
            window.localStorage.setItem("authToken", token);
            
            //On previent axios qu'on a maintenant un header par défaut sur toutes nos futures requetes HTTP
            setAxiosToken(token);
        })

}

/**
 * Positionne le token JWT sur Axios
 * @param {string} token Le token JWT
 */
function setAxiosToken(token){
    axios.defaults.headers["Authorization"] = "Bearer " + token
}

/**
 * Mise en place lors du chargement de l'application
 */
function setup(){
    // 1.Voir si on a un token ?
    const token = window.localStorage.getItem("authToken");
    
    if(token) {
        const {exp: expiration} = jwtDecode(token);
        // 2. Si le token est encore valide 
        if (expiration * 1000 > new Date().getTime()){
             // 3. Donner le token à axios
             setAxiosToken(token);
        }
    }
}

/**
 * Permet de savoir si on est authentifié ou pas
 * @returns boolean
 */
function isAuthenticated(){

    // 1.Voir si on a un token ?
    const token = window.localStorage.getItem("authToken");
    
    if(token) {
        const {exp: expiration} = jwtDecode(token);
        // 2. Si le token est encore valide 
        if (expiration * 1000 > new Date().getTime()){
             return true
        }
        return false;
    }
    return false
}

//Pour que les fonctions soit utilisable de l'exterieur
export default {
    authenticate,
    logout,
    setup,
    isAuthenticated
};