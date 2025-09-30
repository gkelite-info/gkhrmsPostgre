import { DataTypes, Model, Optional } from "sequelize";
import sequelizeConnection from "../config";
import bcrypt from 'bcrypt';

interface customerAttributes {
    id: number;
    firstname: string;
    lastname: string;
    phone: string;
    email: string;
    password: string;
    country: string;
    is_consent_filled: boolean;
    is_deleted: boolean;

    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
}

export interface customerInput extends Optional<customerAttributes, 'id' | 'is_deleted' | 'is_consent_filled'> { }
export interface customerOutput extends Required<customerAttributes> { }

class Customer extends Model<customerAttributes, customerInput> implements customerAttributes {
    public id!: number;
    public firstname!: string;
    public lastname!: string;
    public phone!: string;
    public email!: string;
    public password!: string;
    username: any;

    public validPassword(password: string): boolean {
        return bcrypt.compareSync(password, this.password);
    }

    public country!: string;
    public is_consent_filled!: boolean;
    public is_deleted!: boolean;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
    public readonly deletedAt!: Date;
}

Customer.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    firstname: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    lastname: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    phone: {
        type: DataTypes.STRING(15),
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        },
    },
    country: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    is_consent_filled: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    is_deleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
}, {
    timestamps: true,
    paranoid: true,
    sequelize: sequelizeConnection,
    tableName: 'vertixcustomers',
    hooks: {
        beforeCreate: async (customer: Customer) => {
            const salt = await bcrypt.genSalt(10);
            customer.password = await bcrypt.hash(customer.password, salt);
        },
    },
});
export default Customer;