import { DataTypes, Model, Optional } from "sequelize";
import sequelizeConnection from "../config";
import Employee from "./employee";

interface EmployeeExperienceAttributes {
    id: number;
    employeeId: number;
    company: string;
    role: string;
    startDate: Date;
    endDate?: Date | null;
    location?: string | null;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface EmployeeExperienceInput extends Optional<EmployeeExperienceAttributes, "id"> { }
export interface EmployeeExperienceOutput extends Required<EmployeeExperienceAttributes> { }

class EmployeeExperience extends Model<EmployeeExperienceAttributes, EmployeeExperienceInput> implements EmployeeExperienceAttributes {
    public id!: number;
    public employeeId!: number;
    public company!: string;
    public role!: string;
    public startDate!: Date;
    public endDate!: Date | null;
    public location!: string | null;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

EmployeeExperience.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        employeeId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: { model: "employee", key: "employeeId" }
        },
        company: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        role: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        startDate: {
            type: DataTypes.DATE,
            allowNull: false
        },
        endDate: {
            type: DataTypes.DATE,
            allowNull: true
        },
        location: {
            type: DataTypes.STRING(100),
            allowNull: true
        },
    },
    {
        sequelize: sequelizeConnection,
        tableName: "employee_experience",
        timestamps: true,
    }
);

Employee.hasMany(EmployeeExperience, { foreignKey: "employeeId", as: "experience" });
EmployeeExperience.belongsTo(Employee, { foreignKey: "employeeId", as: "employee" });

export default EmployeeExperience;
