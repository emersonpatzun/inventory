module.exports = (sequelize, DataTypes) => {
    const price = sequelize.define('price', {
        idprice: {
            type: DataTypes.BIGINT,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        general: {
            type: DataTypes.DECIMAL(10,2),
            allowNull: false
        }
    },
    {
        tableName: 'price',
        timestamps: false
    }
    );

    price.associate = function(models) {
        price.belongsTo(models.product, {
            foreignKey: "idproduct",
            as: "product"
        });
    };
    
    return price;
};
