const { Tag, List, Card } = require('../models');

const tagController = {
    getAllTags: async (request, response) => {
        try {
            const tags = await Tag.findAll();
            response.json(tags);
        } catch (error) {
            response.status(404).send('page not found');
        }
    },

    getOneTag: async (request, response, next) => {
        try {
            const tag = await Tag.findByPk(request.params.id, {
            });
            if (!tag) {
                next();
                return;
            }
            response.json(tag);
        } catch (error) {
            response.status(404).send('page not found');
        }
    },

    createNewTag: async (request, response) => {
        try {
            const tag = await Tag.create({
                name: request.body.name,
                color: request.body.color,
            })
            response.json(tag);
        } catch (error) {
            response.status(404).send('page not found');
        }
    },

    addTagToCard: async (request, response) => {
        try {
            const card = await Card.findByPk(request.params.id);
            const tag = await Tag.findByPk(request.body.tag_id);

            const updateTag = await card.addTag(tag)

            response.json(updateTag);
        } catch (error) {
            response.status(404).send('page not found');
        }
    },

    deleteTagFromCard: async (request, response) => {
        try {
            const card = await Card.findByPk(request.params.card_id);
            const tag = await Tag.findByPk(request.params.tag_id);

            // const deleteTag

            const deleteTag = await card.removeTag(tag)

            response.json(deleteTag);
        } catch (error) {
            response.status(404).send('page not found');
        }
    },

    // updateOneTag: async (request, response) => {
    //     try {
    //         const tag = await Tag.update({
    //             name: request.body.name,
    //             color: request.body.color,
    //         }, {
    //             where: {
    //                 id: request.params.id
    //             },
    //             returning: true
    //         })
    //         response.json(tag);
    //     } catch (error) {
    //         response.status(404).send('page not found');
    //     }
    // },

    updateOneTag: async (request, response, next) => {
        try {
            const tag = await Tag.findByPk(request.params.id);
            if (!tag) {
                next();
                return;
            }
            
            for (const key in request.body) {
                tag[key] = request.body[key];
            }
            await tag.save();
            response.json(tag)
        } catch (error) {
            response.status(404).send('page not found');
        }
    },

    deleteOneTag: async (request, response, next) => {
        try {
            const tag = await Tag.destroy({
                where: {
                    id: request.params.id
                },
                returning: true
            })
            if (!tag) {
                next();
                return;
            }
            // response.json(list);
            response.json();
        } catch (error) {
            response.status(404).send('page not found');
        }
    },

    deleteAllTags: async (request, response) => {
        try {
            const tag = await Tag.destroy({
                truncate: true,
                cascade: true
            })
            response.json(tag);
        } catch (error) {
            response.status(404).send('page not found');
        }
    }

}

module.exports = tagController;