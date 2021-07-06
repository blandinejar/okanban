const { List, Card, Tag } = require('../models');

const listController = {
    getAllLists: async (request, response) => {
        try {
            const lists = await List.findAll();
            response.json(lists);
        } catch (error) {
            response.status(404).send('page not found');
        }
    },

    getOneList: async (request, response, next) => {
        try {
            const list = await List.findByPk(request.params.id, {
                // include: [{
                //     association: 'cards',
                //     include: 'tags'
                // }]
            });
            if (!list) {
                next();
                return;
            }
            response.json(list);
        } catch (error) {
            response.status(404).send('page not found');
        }
    },

    getAllCardsWithTags: async (request, response, next) => {
        try {
            const list = await List.findByPk(request.params.id, {
                include: [{
                    association: 'cards',
                    include: 'tags'
                }]
            });
            if (!list) {
                next();
                return;
            }
            response.json(list);
        } catch (error) {
            response.status(404).send('page not found');
        }
    },

    createNewList: async (request, response) => {
        try {
            const list = await List.create({
                name: request.body.name,
                position: request.body.position,
            })
            response.json(list);
        } catch (error) {
            response.status(404).send('page not found');
        }
    },

    // updateOneList: async (request, response) => {
    //     try {
    //         const list = await List.update({
    //             name: request.body.name,
    //             position: request.body.position,
    //         }, {
    //             where: {
    //                 id: request.params.id
    //             },
    //             returning: true
    //         })
    //         response.json(list);
    //     } catch (error) {
    //         response.status(404).send('page not found');
    //     }
    // },

    // méthode quentin
    
    updateOneList: async (request, response, next) => {
        try {
            const list = await List.findByPk(request.params.id);
            if (!list) {
                next();
                return;
            }
            
            for (const key in request.body) {
                list[key] = request.body[key];
            }
            await list.save();
            response.json(list)
        } catch (error) {
            response.status(404).send('page not found');
        }
    },


    deleteOneList: async (request, response, next) => {
        try {
            const list = await List.destroy({
                where: {
                    id: request.params.id
                },
                returning: true
            })
            if (!list) {
                next();
                return;
            }
            // response.json(list);
            response.json({});
        } catch (error) {
            response.status(404).send('page not found');
        }
    },

    deleteAllLists: async (request, response) => {
        try {
            const list = await List.destroy({
                truncate: true,
                cascade: true
            })
            response.json(list);
        } catch (error) {
            response.status(404).send('page not found');
        }
    }
}

module.exports = listController;