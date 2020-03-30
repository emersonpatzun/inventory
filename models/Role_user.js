module.exports = (sequelize, DataTypes) => {
    const roleUser = sequelize.define('roleUser', {
        idroleUser: {
            type: DataTypes.BIGINT,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        }
    },
    {
        tableName: 'roleUser',
        timestamps: false
    }
    );

    roleUser.associate = function(models) {
        roleUser.belongsTo(models.systemUser, {
            foreignKey: "idsystemUser",
            as: "systemUser"
        });
    };

    roleUser.associate = function(models) {
        roleUser.belongsTo(models.role, {
            foreignKey: "idrole",
            as: "role"
        });
    };

    return roleUser;
};
