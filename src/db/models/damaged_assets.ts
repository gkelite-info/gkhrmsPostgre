import { DataTypes, Model, Optional } from "sequelize";
import sequelizeConnection from "../config";
import Employee from "./employee";

interface AssetDamageAttributes {
    id: number;
    employeeId: number;
    assetType: string;
    assetCode: string;
    damageDescription: string;
    reportedOn: Date;
    estimatedCharges: string;
    status: "Pending" | "Approved" | "Paid";
    paymentMode: string;
    remarks?: string;
    
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
}

export interface AssetDamageInput extends Optional<AssetDamageAttributes, "id"> { }
export interface AssetDamageOutput extends Required<AssetDamageAttributes> { }

class AssetDamage extends Model<AssetDamageAttributes, AssetDamageInput> implements AssetDamageAttributes {
    public id!: number;
    public employeeId!: number;
    public assetType!: string;
    public assetCode!: string;
    public damageDescription!: string;
    public reportedOn!: Date;
    public estimatedCharges!: string;
    public status!: "Pending" | "Approved" | "Paid";
    public paymentMode!: string;
    public remarks?: string;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
    public readonly deletedAt!: Date;
}

AssetDamage.init({
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    employeeId: { type: DataTypes.INTEGER, allowNull: false, references: { model: Employee, key: "employeeId" } },
    assetType: { type: DataTypes.STRING(50), allowNull: false },
    assetCode: { type: DataTypes.STRING(100), allowNull: false },
    damageDescription: { type: DataTypes.TEXT, allowNull: false },
    reportedOn: { type: DataTypes.DATE, allowNull: false },
    estimatedCharges: { type: DataTypes.STRING(20), allowNull: false },
    status: { type: DataTypes.ENUM("Pending", "Approved", "Paid"), defaultValue: "Pending" },
    paymentMode: { type: DataTypes.STRING(50), allowNull: false },
    remarks: { type: DataTypes.TEXT, allowNull: true }
}, {
    timestamps: true,
    paranoid: true,
    sequelize: sequelizeConnection,
    tableName: "asset_damage_charges"
});

Employee.hasMany(AssetDamage, { foreignKey: "employeeId", as: "asset_damage_charges" });
AssetDamage.belongsTo(Employee, { foreignKey: "employeeId", as: "employee" });

export default AssetDamage;
