module.exports = (sequelize, DataTypes) => {
    const pointOfSale = sequelize.define('pointOfSale', {
        idpointOfSale: {
            type: DataTypes.BIGINT,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        state: {
            type: DataTypes.STRING,
            allowNull: false
        }
    },
    {
        tableName: 'pointOfSale',
        timestamps: false
    }
    );

    pointOfSale.associate = function(models) {
        pointOfSale.hasMany(models.userPoint, {
            foreignKey: "idpointOfSale",
            as: "userPoint"
        });
    };

    pointOfSale.associate = function(models) {
        pointOfSale.hasMany(models.transaction, {
            foreignKey: "idpointOfSale",
            as: "transaction"
        }); 
    };
    
    pointOfSale.associate = function(models) {
        pointOfSale.hasMany(models.inventory, {
            foreignKey: "idpointOfSale",
            as: "inventory"
        });
    };
    
    return pointOfSale;
};
