import { DataTypes, Optional, Model } from "sequelize";
import sequelizeConnection from "../config";
import Employee from "./employee";


interface employeeProfileAttributes {
    id: number;
    employeeId: number;
    aboutMe?: string | null;
    professionalSummary?: string | null;
    whatILove?: string | null;
    strengths?: string | null;
    passions?: string | null;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface employeeProfileInput extends Optional<employeeProfileAttributes, "id"> { }
export interface employeeProfileOutput extends Required<employeeProfileAttributes> { }


class EmployeeProfile extends Model<employeeProfileAttributes, employeeProfileInput> implements employeeProfileAttributes {
    public id!: number;
    public employeeId!: number;
    public aboutMe!: string | null;
    public professionalSummary!: string | null;
    public whatILove!: string | null;
    public strengths!: string | null;
    public passions!: string | null;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

EmployeeProfile.init({
    id: {
        type: DataTypes.NUMBER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    employeeId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'employee', key: 'employeeId' }
    },
    aboutMe: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    professionalSummary: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    whatILove: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    strengths: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    passions: {
        type: DataTypes.TEXT,
        allowNull: false
    }
}, {
    timestamps: true,
    sequelize: sequelizeConnection,
    tableName: "employee_profiles"
});


Employee.hasOne(EmployeeProfile, { foreignKey: "employeeId" })
EmployeeProfile.belongsTo(Employee, { foreignKey: "employeeId" })

export default EmployeeProfile;