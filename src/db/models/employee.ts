import { DataTypes, Model, Optional } from "sequelize";
import sequelizeConnection from "../config";


interface employeeAttributes {
    employeeId: number;
    firstname: string;
    lastname?: string;
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
    aadhaarNumber?: string | null;
    photoURL?: string | null;
    phone?: string | null;
    address?: string | null;
    physicallyHandicapped?: "Yes" | "No" | null;
    nationality?: string;
    gender: string | null;
    marital_status?: string | null;
    dob?: Date | null;
    panNumber?: string | null;
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
    public firstname!: string;
    public lastname!: string;
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
    public nationality!: string;
    public panNumber!: string | null;
    public aadhaarNumber!: string | null;
    public physicallyHandicapped!: "Yes" | "No" | null | undefined;
    public gender!: string | null;
    public marital_status!: string | null;
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
    firstname: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    lastname: {
        type: DataTypes.STRING(50),
        allowNull: true
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
    panNumber: {
        type: DataTypes.STRING(10),
        allowNull: true,
        unique: true,
        validate: {
            len: [10, 10]
        }
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
    nationality: {
        type: DataTypes.STRING(50),
        allowNull: true
    },
    physicallyHandicapped: {
        type: DataTypes.ENUM("Yes", "No"),
        allowNull: true
    },
    aadhaarNumber: {
        type: DataTypes.STRING(12),
        allowNull: true,
        unique: true,
        validate: { len: [12, 12] }
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
    gender: {
        type: DataTypes.STRING(10),
        allowNull: true
    },
    marital_status: {
        type: DataTypes.STRING(20),
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