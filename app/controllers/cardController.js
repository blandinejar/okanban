const { Card, List, Tag } = require('../models');

const cardController = {
    getAllCards: async (request, response) => {
        try {
            const cards = await Card.findAll();
            response.json(cards);
        } catch (error) {
            response.status(404).send('page not found');
        }
    },

    getOneCard: async (request, response, next) => {
        try {
            const card = await Card.findByPk(request.params.id, {
            });
            if (!card) {
                next();
                return;
            }
            response.json(card);
        } catch (error) {
            response.status(404).send('page not found');
        }
    },
    

    createNewCard: async (request, response) => {
        try {
            const card = await Card.create({
                title: request.body.title,
                position: request.body.position,
                color: request.body.color,
                list_id: request.body.list_id
            })
            response.json(card);
        } catch (error) {
            response.status(404).send('page not found');
        }
    },

    // updateOneCard: async (request, response) => {
    //     try {
    //         const card = await Card.update({
    //             title: request.body.title,
    //             position: request.body.position,
    //             color: request.body.color,
    //             list_id: request.body.list_id
    //         }, {
    //             where: {
    //                 id: request.params.id
    //             },
    //             returning: true
    //         })
    //         response.json({card});
    //     } catch (error) {
    //         response.status(404).send('page not found');
    //     }
    // },

    updateOneCard: async (request, response, next) => {
        try {
            const card = await Card.findByPk(request.params.id);
            if (!card) {
                next();
                return;
            }
            
            for (const key in request.body) {
                card[key] = request.body[key];
            }
            await card.save();
            response.json(card)
        } catch (error) {
            response.status(404).send('page not found');
        }
    },

    deleteOneCard: async (request, response, next) => {
        try {
            const card = await Card.destroy({
                where: {
                    id: request.params.id
                },
                returning: true
            })
            if (!card) {
                next();
                return;
            }
            // response.json({list});
            response.json();
        } catch (error) {
            response.status(404).send('page not found');
        }
    },

    deleteAllCards: async (request, response) => {
        try {
            const card = await Card.destroy({
                truncate: true,
                cascade: true
            })
            response.json(card);
        } catch (error) {
            response.status(404).send('page not found');
        }
    }

    /* tout inclure d'un coup : { include: [{ all: true, nested: true }]}
 */
}

module.exports = cardController;