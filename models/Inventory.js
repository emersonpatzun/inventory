module.exports = (sequelize, DataTypes) => {
    const inventory = sequelize.define('inventory', {
        idinventory: {
            type: DataTypes.BIGINT,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        intialInventory: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        intialInventoryDate: {
            type: DataTypes.DATE,
            allowNull: false
        },
        purchase: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        sale: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        stock: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    },
    {
        tableName: 'inventory',
        timestamps: false
    }
    );
    
    inventory.associate = function(models) {
        inventory.belongsTo(models.pointOfSale, {
            foreignKey: "idpointOfSale",
            as: "pointOfSale"
        });
    };

    inventory.associate = function(models) {
        inventory.belongsTo(models.product, {
            foreignKey: "idproduct",
            as: "product"
        });
    };

    return inventory;
};
