const dotenv = require('dotenv');
dotenv.config();

const {Card, List, Tag} = require('./app/models');

// Card.findAll({

// }).then((cards) => {
//     for (let card of cards) {
//         console.log(card.title);
//     }
// })

List.findAll({
    include: [{
        association: 'cards',
        include: [{
            association: 'tags'
        }]
    }]

}).then((lists) => {
    for (let list of lists) {
        console.log(list.name);
        for (const card of list.cards) {
            console.log(card.title)
        }
    }
})