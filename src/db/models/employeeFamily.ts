import { DataTypes, Model, Optional } from "sequelize";
import sequelizeConnection from "../config";
import Employee from "./employee";

interface employeeFamilyAttributes {
    id: number;
    employeeId: number;
    relation: string;
    name: string;
    dob?: Date | null;
    age?: number | null;
    gender?: string | null;
    mobile?: string | null;
    profession?: string | null;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface employeeFamilyInput extends Optional<employeeFamilyAttributes, "id"> { }
export interface employeeFamilyOutput extends Required<employeeFamilyAttributes> { }

class EmployeeFamily extends Model<employeeFamilyAttributes, employeeFamilyInput> implements employeeFamilyAttributes {
    public id!: number;
    public employeeId!: number;
    public relation!: string;
    public name!: string;
    public dob!: Date | null;
    public age!: number | null;
    public gender!: string | null;
    public mobile!: string | null;
    public profession!: string | null;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

EmployeeFamily.init({
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    employeeId: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'employee', key: 'employeeId' } },
    relation: { type: DataTypes.STRING(50), allowNull: false },
    name: { type: DataTypes.STRING(100), allowNull: false },
    dob: { type: DataTypes.DATE, allowNull: true },
    age: { type: DataTypes.INTEGER, allowNull: true },
    gender: { type: DataTypes.STRING(10), allowNull: true },
    mobile: { type: DataTypes.STRING(20), allowNull: true },
    profession: { type: DataTypes.STRING(50), allowNull: true },
}, {
    sequelize: sequelizeConnection,
    tableName: 'employee_family',
    timestamps: true
});

Employee.hasMany(EmployeeFamily, { foreignKey: 'employeeId', as: "employee_family" });
EmployeeFamily.belongsTo(Employee, { foreignKey: 'employeeId', as: "employee" });

export default EmployeeFamily;
