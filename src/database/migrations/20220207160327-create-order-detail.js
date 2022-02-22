'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('OrderDetails', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      quantity: {
        type: Sequelize.INTEGER
      },
      subtotal: {
        type: Sequelize.INTEGER
      },
      order_id: {
        type: Sequelize.INTEGER,
        references:{
          model: "orders",
          key: "id"
        }
      },
      product_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "products",
          key: "id"
        }

      },
      user_add_id: {
        type: Sequelize.INTEGER,
        references:{
          model: "shippings",
          key: "id"
        }
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
    await queryInterface.dropTable('OrderDetails');
  }
};