'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      'Restaurants',
      Array.from({ length: 10 }).map((_, i) => {
        return {
          name: `restaurant-${i}`,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
      })
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Todos', null);
  },
};
