module.exports = (sequelize, DataTypes) => {
    const role = sequelize.define('role', {
        idrole: {
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
        tableName: 'role',
        timestamps: false
    }
    );
    
    role.associate = function (models) {
        role.hasMany(models.roleUser, {
            foreignKey: "idrole",
            as: "roleUser"
        });
    };

    return role;
};
