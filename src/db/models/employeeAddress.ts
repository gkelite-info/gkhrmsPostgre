import { DataTypes, Model, Optional } from "sequelize";
import sequelizeConnection from "../config";
import Employee from "./employee";

interface employeeAddressAttributes {
    id: number;
    employeeId: number;
    type: string;
    addressLine: string;
    city?: string | null;
    state?: string | null;
    country?: string | null;
    postalCode?: string | null;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface employeeAddressInput extends Optional<employeeAddressAttributes, "id"> { }
export interface employeeAddressOutput extends Required<employeeAddressAttributes> { }

class EmployeeAddress extends Model<employeeAddressAttributes, employeeAddressInput> implements employeeAddressAttributes {
    public id!: number;
    public employeeId!: number;
    public type!: string;
    public addressLine!: string;
    public city!: string | null;
    public state!: string | null;
    public country!: string | null;
    public postalCode!: string | null;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

EmployeeAddress.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    employeeId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references:
            { model: 'employee', key: 'employeeId' }
    },
    type: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    addressLine: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    city: {
        type: DataTypes.STRING(50),
        allowNull: true
    },
    state: {
        type: DataTypes.STRING(50),
        allowNull: true
    },
    country: {
        type: DataTypes.STRING(50),
        allowNull: true
    },
    postalCode: {
        type: DataTypes.STRING(20),
        allowNull: true
    },
}, {
    sequelize: sequelizeConnection,
    tableName: 'employee_addresses',
    timestamps: true
});

Employee.hasMany(EmployeeAddress, { foreignKey: 'employeeId', as: "employee_addresses" });
EmployeeAddress.belongsTo(Employee, { foreignKey: 'employeeId', as: "employee" });

export default EmployeeAddress;
