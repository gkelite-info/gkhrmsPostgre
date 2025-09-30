import { DataTypes, Model, Optional } from "sequelize";
import sequelizeConnection from "../config";
import Employee from "./employee";


interface employeeEducationAttributes {
    id: number;
    employeeId: number;
    branch: string;
    specialization?: string | null;
    university?: string | null;
    yearOfCompletion?: string | null;
    cgpa?: string | null;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface employeeEducationInput extends Optional<employeeEducationAttributes, "id"> { }
export interface employeeEducationOutput extends Required<employeeEducationAttributes> { }

class EmployeeEducation extends Model<employeeEducationAttributes, employeeEducationInput> implements employeeEducationAttributes {
    public id!: number;
    public employeeId!: number;
    public branch!: string;
    public specialization!: string | null;
    public university!: string | null;
    public yearOfCompletion!: string | null;
    public cgpa!: string | null;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

EmployeeEducation.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    employeeId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "employee", key: "employeeId"
        }
    },
    branch: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    specialization: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    university: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    yearOfCompletion: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    cgpa: {
        type: DataTypes.STRING(10),
        allowNull: true
    }
}, {
    timestamps: true,
    sequelize: sequelizeConnection,
    tableName: "employee_education"
});

Employee.hasMany(EmployeeEducation, { foreignKey: "employeeId", as: "employee_education" })
EmployeeEducation.belongsTo(Employee, { foreignKey: "employeeId", as: "employee" });

export default EmployeeEducation;