import { DataTypes, Model, Optional } from "sequelize";
import sequelizeConnection from "../config";
import Employee from "./employee";

interface FamilyDetailsAttributes {
  id: number;
  employeeId: number;
  spouseName?: string | null;
  spouseDOB?: Date | null;
  spouseGender?: string | null;

  fatherName?: string | null;
  fatherDOB?: Date | null;
  fatherAge?: number | null;
  fatherMobile?: string | null;
  fatherProfession?: string | null;
  fatherGender?: string | null;

  motherName?: string | null;
  motherDOB?: Date | null;
  motherAge?: number | null;
  motherMobile?: string | null;
  motherProfession?: string | null;
  motherGender?: string | null;

  willingToOPT?: boolean | null;

  createdAt?: Date;
  updatedAt?: Date;
}

export interface FamilyDetailsInput extends Optional<FamilyDetailsAttributes, "id"> {}
export interface FamilyDetailsOutput extends Required<FamilyDetailsAttributes> {}

class FamilyDetails extends Model<FamilyDetailsAttributes, FamilyDetailsInput> implements FamilyDetailsAttributes {
  public id!: number;
  public employeeId!: number;
  public spouseName!: string | null;
  public spouseDOB!: Date | null;
  public spouseGender!: string | null;

  public fatherName!: string | null;
  public fatherDOB!: Date | null;
  public fatherAge!: number | null;
  public fatherMobile!: string | null;
  public fatherProfession!: string | null;
  public fatherGender!: string | null;

  public motherName!: string | null;
  public motherDOB!: Date | null;
  public motherAge!: number | null;
  public motherMobile!: string | null;
  public motherProfession!: string | null;
  public motherGender!: string | null;

  public willingToOPT!: boolean | null;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

FamilyDetails.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    employeeId: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'employee', key: 'employeeId' } },
    spouseName: { type: DataTypes.STRING(100), allowNull: true },
    spouseDOB: { type: DataTypes.DATE, allowNull: true },
    spouseGender: { type: DataTypes.STRING(10), allowNull: true },
    fatherName: { type: DataTypes.STRING(100), allowNull: true },
    fatherDOB: { type: DataTypes.DATE, allowNull: true },
    fatherAge: { type: DataTypes.INTEGER, allowNull: true },
    fatherMobile: { type: DataTypes.STRING(20), allowNull: true },
    fatherProfession: { type: DataTypes.STRING(100), allowNull: true },
    fatherGender: { type: DataTypes.STRING(10), allowNull: true },
    motherName: { type: DataTypes.STRING(100), allowNull: true },
    motherDOB: { type: DataTypes.DATE, allowNull: true },
    motherAge: { type: DataTypes.INTEGER, allowNull: true },
    motherMobile: { type: DataTypes.STRING(20), allowNull: true },
    motherProfession: { type: DataTypes.STRING(100), allowNull: true },
    motherGender: { type: DataTypes.STRING(10), allowNull: true },
    willingToOPT: { type: DataTypes.BOOLEAN, allowNull: true },
  },
  {
    sequelize: sequelizeConnection,
    tableName: "family_details",
    timestamps: true,
  }
);

Employee.hasOne(FamilyDetails, { foreignKey: "employeeId", as: "familyDetails" });
FamilyDetails.belongsTo(Employee, { foreignKey: "employeeId", as: "employee" });

export default FamilyDetails;