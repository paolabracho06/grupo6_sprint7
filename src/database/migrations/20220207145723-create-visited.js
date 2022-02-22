'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Visiteds', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      visited: {
        type: Sequelize.INTEGER
      },
      product_id: {
        type: Sequelize.INTEGER,
        references:{
          model: "products",
          key: "id"
        }
      },
      user_id: {
        type: Sequelize.INTEGER,
        references:{
          model: "users",
          key: "id"
        }
      },
      time: {
        type: Sequelize.DATE
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Visiteds');
  }
};