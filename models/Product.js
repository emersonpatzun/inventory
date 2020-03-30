module.exports = (sequelize, DataTypes) => {
    const product = sequelize.define('product', {
        idproduct:{
            type: DataTypes.BIGINT,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull:  false
        },
        category: {
            type: DataTypes.STRING,
            allowNull: false
        },
        status: {
            type: DataTypes.STRING,
            allowNull: false
        },
        minium_stock: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    },
    {
        tableName: 'product', 
        timestamps: false
    }
    );

    product.associate = function(models) {
        product.hasMany(models.price, {
            foreignKey: "idproduct",
            as: "price"
        });
    };
    
    product.associate = function(models) {
        product.hasMany(models.transactionDetail, {
            foreignKey: "idproduct",
            as: "transactionDetail"
        });
    };

    product.associate = function(models) {
        product.hasMany(models.inventory, {
            foreignKey: "idproduct",
            as: "inventory"
        });
    };

    return product;
};
