'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Products', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      price_inv: {
        type: Sequelize.INTEGER
      },
      price_who: {
        type: Sequelize.INTEGER
      },
      stock: {
        type: Sequelize.INTEGER
      },
      stock_min: {
        type: Sequelize.INTEGER
      },
      stock_max: {
        type: Sequelize.INTEGER
      },
      cat_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'cats',
          key: 'id'
        }
      },
      size_id: {
        type: Sequelize.INTEGER,
        references: {
          model:'sizes',
          key: 'id'
        }
      },
      discount_id: {
        type: Sequelize.INTEGER,
        references: {
          model:'discounts',
          key: 'id'
        }
      },
      description: {
        type: Sequelize.STRING
      },
      visibility: {
        type: Sequelize.INTEGER
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
    await queryInterface.dropTable('Products');
  }
};