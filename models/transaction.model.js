module.exports = (sequelize, DataTypes) => {
    const transaction = sequelize.define('transaction', {
        idtransaction: {
            type: DataTypes.BIGINT,
            allowNull: false, 
            primaryKey: true,
            autoIncrement: true
        },
        date: {
            type: DataTypes.DATE,
            allowNull: false
        },
        role: {
            type: DataTypes.STRING,
            allowNull: false
        }
    },
    {
        tableName: 'transaction',
        timestamps: false
    }
    );

    transaction.associate  = function(models) {
        transaction.belongsTo(models.pointOfSale, {
            foreignKey: "idpointOfSale",
            as: "pointOfSale"
        });
    };

    transaction.associate = function(models) {
        transaction.belongsTo(models.User, {
            foreignKey: "idUser",
            as: "user"
        });
    };
    
    //----------------

    transaction.associate = function(models) {
        transaction.hasMany(models.transactionDetail, {
            foreignKey: "idtransaction",
            as: "transactioinDetail"
        });
    };

    return transaction;
};
