module.exports = (sequelize, DataTypes) => {
    const systemUser = sequelize.define('systemUser', {
        idsystemUser: {
            type: DataTypes.BIGINT,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        lastName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        userName: {
            type: DataTypes.STRING,
            allowNull: false 
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        state: {
            type: DataTypes.STRING,
            allowNull: false
        }
    },
    {
        tableName: 'systemUser',
        timestamps: false
    }
    );

    systemUser.associate = function (models) {
        systemUser.hasMany(models.userPoint, {
            foreignKey: "idsystemUser",
            as: "userPoint"
        });
    };

    systemUser.associate = function (models) {
        systemUser.hasMany(models.roleUser, {
            foreignKey: "idsystemUser",
            as: "roleUser"
        });
    };

    systemUser.associate = function(models) {
        systemUser.hasMany(models.transaction, {
            foreignKey: "idsystemUser",
            as: "transaction"
        });
    };

    return systemUser;
};

