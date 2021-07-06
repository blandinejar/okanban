const {Model, DataTypes} = require('sequelize');
const sequelize = require('../database');

class Tag extends Model {}

Tag.init({
    name: {
        type: DataTypes.TEXT,
        defaultValue: '',
        allowNull: false,
        unique: true
    }, 
    color: {
        type: DataTypes.TEXT,
        defaultValue: '#FFF',
        allowNull: false
    } 
}, {
    sequelize,
    tableName: 'tag'
});

module.exports = Tag;