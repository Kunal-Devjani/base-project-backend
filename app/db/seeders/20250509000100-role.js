'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.bulkInsert(
            'role',
            [
                {
                    id: '4db03064-6826-4a94-8943-5dbbba2f5de2',
                    name: 'Admin',
                    status: '1',
                    createdAt: '2025-04-02 07:39:04',
                    updatedAt: '2025-04-02 07:39:04',
                },
                {
                    id: '766b7ee4-9347-4752-84ab-24b9cc7c996e',
                    name: 'Customer',
                    status: '1',
                    createdAt: '2025-04-02 07:41:04',
                    updatedAt: '2025-04-02 07:41:04',
                },
            ],
            {}
        );
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('role', null, {});
    },
};
