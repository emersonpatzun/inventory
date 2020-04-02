module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        idUser: {
            type: DataTypes.BIGINT,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        lastName: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        userName: {
            type: DataTypes.STRING(100),
            allowNull: false 
        },
        email: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        role: {
            type: DataTypes.STRING,
            allowNull: false
        },
        state: {
            type: DataTypes.STRING,
            allowNull: false
        }
    },
    {
        tableName: 'user',
        timestamps: false
    }
    );

    User.associate = function (models) {
        User.hasMany(models.userPoint, {
            foreignKey: "idUser",
            as: "userPoint"
        });
    };

   
    return User;
};

