const { Tag, Card, List } = require('../models');

const mainController = {
    homePage: (request, response) => {
        response.send(`bonjour, voici la page d'accueil`);
    }

}

module.exports = mainController;