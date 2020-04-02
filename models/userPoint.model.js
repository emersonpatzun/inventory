module.exports = (sequelize, DataTypes) => {
        const userPoint  = sequelize.define('userPoint', {
            idUserPoint: {
                type: DataTypes.BIGINT,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true
            }
        },
        {
            tableName: 'userPoint',
            timestamps: false
        }
        );

        userPoint.associate = function(models) {
            userPoint.belongsTo(models.User, {
                foreignKey: "idUser",
                as: "user"
            });
        };
        userPoint.associate = function(models) {
            userPoint.belongsTo(models.pointOfSale, {
                foreignKey: "idpointOfSale",
                as: "pointOfSale"
            });
        };



        return userPoint; 
}; 
