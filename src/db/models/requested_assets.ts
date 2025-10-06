import { DataTypes, Model, Optional } from "sequelize";
import sequelizeConnection from "../config";
import Employee from "./employee";

interface RequestedAssetAttributes {
    id: number;
    employeeId: number;
    requestId: string;
    assetType: string;
    assetRequested: string;
    requestedOn: Date;
    priority: "High" | "Medium" | "Low";
    status: "Pending" | "Approved" | "Rejected";
    approvedBy?: string;
    expectedAllocation?: Date;
    remarks?: string;
    
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
}

export interface RequestedAssetInput extends Optional<RequestedAssetAttributes, "id"> { }
export interface RequestedAssetOutput extends Required<RequestedAssetAttributes> { }

class RequestedAsset extends Model<RequestedAssetAttributes, RequestedAssetInput> implements RequestedAssetAttributes {
    public id!: number;
    public employeeId!: number;
    public requestId!: string;
    public assetType!: string;
    public assetRequested!: string;
    public requestedOn!: Date;
    public priority!: "High" | "Medium" | "Low";
    public status!: "Pending" | "Approved" | "Rejected";
    public approvedBy?: string;
    public expectedAllocation?: Date;
    public remarks?: string;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
    public readonly deletedAt!: Date;
}

RequestedAsset.init({
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    employeeId: { type: DataTypes.INTEGER, allowNull: false, references: { model: Employee, key: "employeeId" } },
    requestId: { type: DataTypes.STRING(50), allowNull: false, unique: true },
    assetType: { type: DataTypes.STRING(50), allowNull: false },
    assetRequested: { type: DataTypes.STRING(100), allowNull: false },
    requestedOn: { type: DataTypes.DATE, allowNull: false },
    priority: { type: DataTypes.ENUM("High", "Medium", "Low"), defaultValue: "Medium" },
    status: { type: DataTypes.ENUM("Pending", "Approved", "Rejected"), defaultValue: "Pending" },
    approvedBy: { type: DataTypes.STRING(100), allowNull: true },
    expectedAllocation: { type: DataTypes.DATE, allowNull: true },
    remarks: { type: DataTypes.TEXT, allowNull: true }
}, {
    timestamps: true,
    paranoid: true,
    sequelize: sequelizeConnection,
    tableName: "requested_assets"
});

Employee.hasMany(RequestedAsset, { foreignKey: "employeeId", as: "requested_assets" });
RequestedAsset.belongsTo(Employee, { foreignKey: "employeeId", as: "employee" });

export default RequestedAsset;
