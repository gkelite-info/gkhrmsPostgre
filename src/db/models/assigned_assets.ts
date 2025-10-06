import { DataTypes, Model, Optional } from "sequelize";
import sequelizeConnection from "../config";
import Employee from "./employee";

interface AssignedAssetAttributes {
    id: number;
    employeeId: number;
    assetType: string;
    asset: string;
    assetCategory: string;
    assignedOn: Date;
    acknowledgementStatus: "Acknowledged" | "Pending";
    latestCondition: string;
    
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
}

export interface AssignedAssetInput extends Optional<AssignedAssetAttributes, "id"> { }
export interface AssignedAssetOutput extends Required<AssignedAssetAttributes> { }

class AssignedAsset extends Model<AssignedAssetAttributes, AssignedAssetInput> implements AssignedAssetAttributes {
    public id!: number;
    public employeeId!: number;
    public assetType!: string;
    public asset!: string;
    public assetCategory!: string;
    public assignedOn!: Date;
    public acknowledgementStatus!: "Acknowledged" | "Pending";
    public latestCondition!: string;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
    public readonly deletedAt!: Date;
}

AssignedAsset.init({
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    employeeId: { type: DataTypes.INTEGER, allowNull: false, references: { model: Employee, key: "employeeId" } },
    assetType: { type: DataTypes.STRING(50), allowNull: false },
    asset: { type: DataTypes.STRING(100), allowNull: false },
    assetCategory: { type: DataTypes.STRING(50), allowNull: false },
    assignedOn: { type: DataTypes.DATE, allowNull: false },
    acknowledgementStatus: { type: DataTypes.ENUM("Acknowledged", "Pending"), defaultValue: "Pending" },
    latestCondition: { type: DataTypes.STRING(50), allowNull: false }
}, {
    timestamps: true,
    paranoid: true,
    sequelize: sequelizeConnection,
    tableName: "assigned_assets"
});

Employee.hasMany(AssignedAsset, { foreignKey: "employeeId", as: "assigned_assets" });
AssignedAsset.belongsTo(Employee, { foreignKey: "employeeId", as: "employee" });

export default AssignedAsset;
