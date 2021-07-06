const Card = require('./card');
const List = require('./list');
const Tag = require('./tag');



Card.belongsTo(List, {
    foreignKey: "list_id",
    as: "list"
});

List.hasMany(Card, {
    foreignKey: "list_id",
    as: "cards",
    onDelete: 'cascade'
});

Card.belongsToMany(Tag, {
    as: "tags",
    through: 'tag_belongsto_card',
    foreignKey: 'card_id',
    otherKey: 'tag_id',
    onDelete: 'cascade'
});

Tag.belongsToMany(Card, {
    as: "cards",
    through: 'tag_belongsto_card',
    foreignKey: 'tag_id',
    otherKey: 'card_id',
    onDelete: 'cascade'
});




module.exports = {Card, List, Tag};