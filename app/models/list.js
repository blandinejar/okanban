const sequelize = require('./../database');
const {DataTypes, Model} = require('sequelize');

class List extends Model {}

List.init({
  name: {
    type: DataTypes.TEXT,
    defaultValue: '',
    allowNull: false,
    validate: {
      notEmpty: true,
    }
  },
  position: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    allowNull: false
  },
}, {
  defaultScope: {
    include: [{
      association: 'cards',
      include: 'tags'
    }],
    order: [
      ['position', 'ASC'],
      ['cards', 'position', 'ASC'],
    ]
  },
  sequelize,
  tableName: 'list'
});

module.exports = List;