import { DataTypes, Model, Optional } from "sequelize";
import sequelizeConnection from "../config";
import Employee from "./employee";

interface SiblingAttributes {
    id: number;
    employeeId: number;
    name: string;
    dob?: Date | null;
    gender?: string | null;
    mobile?: string | null;
    profession?: string | null;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface SiblingInput extends Optional<SiblingAttributes, "id"> { }
export interface SiblingOutput extends Required<SiblingAttributes> { }

class Sibling extends Model<SiblingAttributes, SiblingInput> implements SiblingAttributes {
    public id!: number;
    public employeeId!: number;
    public name!: string;
    public dob!: Date | null;
    public gender!: string | null;
    public mobile!: string | null;
    public profession!: string | null;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

Sibling.init(
    {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        employeeId: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'employee', key: 'employeeId' } },
        name: { type: DataTypes.STRING(100), allowNull: false },
        dob: { type: DataTypes.DATE, allowNull: true },
        gender: { type: DataTypes.STRING(10), allowNull: true },
        mobile: { type: DataTypes.STRING(20), allowNull: true },
        profession: { type: DataTypes.STRING(100), allowNull: true },
    },
    {
        sequelize: sequelizeConnection,
        tableName: "siblings",
        timestamps: true,
    }
);

Employee.hasMany(Sibling, { foreignKey: "employeeId", as: "siblings" });
Sibling.belongsTo(Employee, { foreignKey: "employeeId", as: "employee" });

export default Sibling;
