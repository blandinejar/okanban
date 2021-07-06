const express = require('express');

const {mainController, cardController, listController, tagController} = require('./controllers');

const router = express.Router();

// page d'accueil, route test
router.get('/', mainController.homePage);

            /*  
            LISTS 
            */

// récupérer toutes les listes
router.get('/lists', listController.getAllLists);

// récupérer une liste via son ID
router.get('/lists/:id', listController.getOneList);

// récupérer les cartes d'une liste avec ses tags
router.get('/lists/:id/cards', listController.getAllCardsWithTags);

// créer une liste
router.post('/lists', listController.createNewList);

// mettre à jour une liste via son ID
router.patch('/lists/:id', listController.updateOneList);

// supprimer une liste via son ID
router.delete('/lists/:id', listController.deleteOneList);

// supprimer toutes les listes
router.delete('/lists', listController.deleteAllLists);


            /*  
            CARDS 
            */

// récupérer toutes les cartes
router.get('/cards', cardController.getAllCards);

// créer une carte
router.post('/cards', cardController.createNewCard);

// associe tag à la carte ciblée
router.post('/cards/:id/tag', tagController.addTagToCard);

// récupérer une carte via son ID
router.get('/cards/:id', cardController.getOneCard);

// mettre à jour une carte via son ID
router.patch('/cards/:id', cardController.updateOneCard);

// supprimer une carte via son ID
router.delete('/cards/:id', cardController.deleteOneCard);

//supprimer toutes les cartes
router.delete('/cards', cardController.deleteAllCards);

            /*  
            TAGS 
            */

// récupérer tous les tags
router.get('/tags', tagController.getAllTags);

    // récupérer un tag via son ID
router.get('/tags/:id', tagController.getOneTag);

// créer un tag
router.post('/tags', tagController.createNewTag);

// supprimer l'association entre le tag et la carte
router.delete('/cards/:card_id/tag/:tag_id', tagController.deleteTagFromCard);

// mettre à jour un tag via son ID
router.patch('/tags/:id', tagController.updateOneTag);

// supprimer un tag via son ID
router.delete('/tags/:id', tagController.deleteOneTag);

// supprimer tous les tags
router.delete('/tags', tagController.deleteAllTags);


module.exports = router;