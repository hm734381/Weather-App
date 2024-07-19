import Keycloak from 'keycloak-js';

let keycloak = null;

const initKeycloak = (onAuthenticatedCallback) => {
  if (!keycloak) {
    keycloak = new Keycloak({
      url: 'http://localhost:8080',
      realm: 'Weather-MICROSERVICE',
      clientId: 'react-frontend',
    });

    keycloak.init({ onLoad: 'login-required' })
      .then((authenticated) => {
        if (authenticated) {
          onAuthenticatedCallback();
        } else {
          console.warn('User is not authenticated!');
          keycloak.login();
        }
      })
      .catch(console.error);
  } else {
    onAuthenticatedCallback();
  }
};

const doLogin = () => keycloak.login();
const doLogout = () => keycloak.logout();
const getToken = () => keycloak.token;
const getUsername = () => keycloak.tokenParsed?.preferred_username;

const KeycloakService = {
  initKeycloak,
  doLogin,
  doLogout,
  getToken,
  getUsername,
};

export default KeycloakService;
