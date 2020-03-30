module.exports = (sequelize, DataTypes) => {
    const transactionType = sequelize.define('transactionType', {
        idtransactionType: {
            type: DataTypes.BIGINT,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        description: {
            type: DataTypes.STRING,
            allowNull: false
        }
    },
    {
        tableName: 'transaction_type',
        timestamps: false
    }
    );

    transactionType.associate = function(models) {
        transactionType.hasMany(models.transaction, {
            foreingKey: "idtransactionType",
            as: "transaction"
        });
    };

    return transactionType;
};
