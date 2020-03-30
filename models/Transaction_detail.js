module.exports = (sequelize, DataTypes) => {
    const transactionDetail = sequelize.define('transactionDetail', {
        idtransactionDetail: {
            type: DataTypes.BIGINT,
            allowNull: false,
            primaryKey: true, 
            autoIncrement: true
        },
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    },
    {
        tableName: 'transactionDetail',
        timestamps: false
    }
    );

    transactionDetail.associate = function(models) {
        transactionDetail.belongsTo(models.transaction, {
            foreignKey: "idtransaction",
            as: "transaction"
        });
    };

    transactionDetail.associate = function(models) {
        transactionDetail.belongsTo(models.product, {
            foreignKey: "idproduct",
            as: "product"
        });
    };

    return transactionDetail;
};
