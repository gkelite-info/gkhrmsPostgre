import { DataTypes, Model, Optional } from "sequelize";
import sequelizeConnection from "../config";
import Employee from "./employee";

interface employeeIdentityAttributes {
    id: number;
    employeeId: number;
    aadhaarNumber?: string | null;
    panNumber?: string | null;
    enrollmentNumber?: string | null;
    photoIdFile?: string | null;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface employeeIdentityInput extends Optional<employeeIdentityAttributes, "id"> { }
export interface employeeIdentityOutput extends Required<employeeIdentityAttributes> { }

class EmployeeIdentity extends Model<employeeIdentityAttributes, employeeIdentityInput> implements employeeIdentityAttributes {
    public id!: number;
    public employeeId!: number;
    public aadhaarNumber!: string | null;
    public panNumber!: string | null;
    public enrollmentNumber!: string | null;
    public photoIdFile!: string | null;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

EmployeeIdentity.init({
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    employeeId: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'employee', key: 'employeeId' } },
    aadhaarNumber: { type: DataTypes.STRING(20), allowNull: true },
    panNumber: { type: DataTypes.STRING(20), allowNull: true },
    enrollmentNumber: { type: DataTypes.STRING(50), allowNull: true },
    photoIdFile: { type: DataTypes.STRING(255), allowNull: true },
}, {
    sequelize: sequelizeConnection,
    tableName: 'employee_identity',
    timestamps: true
});

Employee.hasOne(EmployeeIdentity, { foreignKey: 'employeeId', as: "employee_identity" });
EmployeeIdentity.belongsTo(Employee, { foreignKey: 'employeeId', as: "employee" });

export default EmployeeIdentity;
