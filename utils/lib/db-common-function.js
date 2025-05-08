const db = require('../../app/db/models');
const enums = require('./enums');
const { status } = require('./messages/api.response');
const common = require('./common-function');
const { Op } = require('sequelize');
const { default: mongoose } = require('mongoose');

module.exports = {
    async hasAnyChildren(rowInstance, exclude = []) {
        try {
            // Get model name from row instance
            let modelName = rowInstance.constructor.name;

            // Get all associations for model
            let associations = db[modelName].associations;

            // Filtering only HasMany relation
            const hasManyAssociations = Object.values(associations).filter((association) => association.associationType === 'HasMany');

            // Get the associated model names
            const associatedModelData = hasManyAssociations.map((association) => {
                let data = {
                    model: association.target.name,
                    foreignKey: association.foreignKey,
                    count: association.accessors.count,
                };
                return data;
            });

            let childrenData = [];

            // Check if data exist for each HasMany relation
            for (const row of associatedModelData) {
                if (exclude.includes(row.model)) continue;
                let currentModel = db[row.model];
                let whereCondition = {};

                whereCondition[row.foreignKey] = rowInstance.id;
                if (Object.keys(currentModel.rawAttributes).includes('deletedAt')) {
                    whereCondition.deletedAt = null;
                }
                try {
                    let count = await currentModel.count({
                        where: {
                            ...whereCondition,
                        },
                    });
                    if (count != 0) {
                        // If row count > 0 then add in array
                        childrenData.push({
                            model: row.model,
                            childrenCount: count,
                        });

                        // Break loop when first relation with row count > 0 is found.
                        break;
                    }
                } catch (err) {
                    // eslint-disable-next-line no-console
                    console.log('some error', err);
                }
            }

            let hasChildren = childrenData?.length > 0 ? true : false;
            return Promise.resolve({
                hasChildren: hasChildren,
                message: hasChildren ? `Data is associated with this ${modelName}` : 'No children available.',
            });
        } catch (err) {
            return Promise.reject(err);
        }
    },
};
