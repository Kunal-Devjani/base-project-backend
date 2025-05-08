'use strict';
module.exports = {
    async up(queryInterface, DataTypes) {
        await queryInterface.createTable('user', {
            id: {
                type: DataTypes.UUID,
                primaryKey: true,
                allowNull: false,
                defaultValue: DataTypes.UUIDV4,
            },
            firstName: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            lastName: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            email: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            password: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            roleId: {
                type: DataTypes.UUID,
                allowNull: false,
                references: {
                    model: 'role',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'NO ACTION',
            },
            isEmailVerified: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
            verificationCode: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            status: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: true,
            },
            createdAt: {
                allowNull: false,
                type: DataTypes.DATE,
            },
            createdBy: {
                type: DataTypes.UUID,
                references: {
                    model: 'user',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'NO ACTION',
            },
            updatedAt: {
                allowNull: true,
                type: DataTypes.DATE,
            },
            updatedBy: {
                type: DataTypes.UUID,
                references: {
                    model: 'user',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'NO ACTION',
            },
            deletedAt: {
                allowNull: true,
                type: DataTypes.DATE,
            },
            deletedBy: {
                type: DataTypes.UUID,
                references: {
                    model: 'user',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'NO ACTION',
            },
        });
    },
    async down(queryInterface, DataTypes) {
        await queryInterface.dropTable('user');
    },
};
