import { DataTypes, Model, Optional } from "sequelize";
import sequelizeConnection from "../config";


interface employeeAttributes {
    employeeId: number;
    fullname: string;
    email: string;
    password: string;
    role: string;
    is_deleted: boolean;
    department?: string | null;
    designation?: string | null;
    managerId?: number | null;
    location?: string | null;
    dateOfJoining?: Date | null;
    status?: string;
    photoURL?: string | null;

    phone?: string | null;
    address?: string | null;

    dob?: Date | null;
    bloodGroup?: string | null;
    emergencyContact?: string | null;

    emailVerificationToken?: string | null;
    emailVerificationExpires?: Date | null;
    isEmailVerified?: boolean;

    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
}

export interface employeeInput extends Optional<employeeAttributes, "employeeId" | "is_deleted"> { }
export interface employeeOutput extends Required<employeeAttributes> { }

class Employee extends Model<employeeAttributes, employeeInput> implements employeeAttributes {
    public employeeId!: number;
    public fullname!: string;
    public email!: string;
    public role!: string;
    public password!: string;
    public is_deleted!: boolean;
    public department!: string | null;
    public designation!: string | null;
    public managerId!: number | null;
    public location!: string | null;
    public dateOfJoining!: Date | null;
    public status!: string;
    public photoURL!: string | null;

    public phone!: string | null;
    public address!: string | null;

    public dob!: Date | null;
    public bloodGroup!: string | null;
    public emergencyContact!: string | null;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
    public readonly deletedAt!: Date;
    public isEmailVerified!: boolean;
    public emailVerificationToken!: string | null;
    public emailVerificationExpires!: Date | null;
}

Employee.init({
    employeeId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    fullname: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    role: {
        type: DataTypes.STRING(20),
        allowNull: true
    },
    password: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    is_deleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    department: {
        type: DataTypes.STRING(50),
        allowNull: true
    },
    designation: {
        type: DataTypes.STRING(50),
        allowNull: true
    },
    managerId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: { model: 'employee', key: 'employeeId' }
    },
    location: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    dateOfJoining: {
        type: DataTypes.DATE,
        allowNull: true
    },
    status: {
        type: DataTypes.STRING(20),
        defaultValue: 'active'
    },
    photoURL: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    phone: {
        type: DataTypes.STRING(20),
        allowNull: true
    },
    address: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    dob: {
        type: DataTypes.DATE,
        allowNull: true
    },
    bloodGroup: {
        type: DataTypes.STRING(5),
        allowNull: true
    },
    emergencyContact: {
        type: DataTypes.STRING(100),
        allowNull: true
    },


    emailVerificationToken: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    emailVerificationExpires: {
        type: DataTypes.DATE,
        allowNull: true
    },
    isEmailVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
}, {
    timestamps: true,
    paranoid: true,
    sequelize: sequelizeConnection,
    tableName: 'employee'
});

Employee.belongsTo(Employee, { as: 'manager', foreignKey: 'managerId' })

export default Employee;