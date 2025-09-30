import express, { Request, Response } from 'express';
import Employee from '../models/employee';
import bcrypt from 'bcrypt';
import { generateToken } from '../utils/authRoutes';
import nodemailer from 'nodemailer';
import { protectEmployee } from '../../middleware/authMiddleware';

interface OTPRecord {
    otp: number;
    expires: number;
}

const otpStore: Record<string, OTPRecord> = {};
const employeeRouter = express.Router();

// Extend Request to include employee for middleware
interface AuthenticatedRequest extends Request {
    employee?: Employee; // Instance of Sequelize Employee
}

// -------------------- SEND OTP --------------------
employeeRouter.post('/send-otp', async (req: Request, res: Response) => {
    try {
        const { email } = req.body as { email: string };
        if (!email) return res.status(400).json({ message: 'Email is required' });

        const employee = await Employee.findOne({ where: { email } });
        if (!employee) return res.status(404).json({ message: 'Employee not found' });

        const otp = Math.floor(1000 + Math.random() * 9000).toString();

        // Store OTP in DB
        employee.emailVerificationToken = otp;
        employee.emailVerificationExpires = new Date(Date.now() + 30 * 60 * 1000); // 30 min
        await employee.save();

        // Send email
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT),
            auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
        });

        await transporter.sendMail({
            from: `"GKHRMS" <${process.env.SMTP_FROM_EMAIL}>`,
            to: email,
            subject: 'Your OTP for login',
            html: `<p>Your OTP is <b>${otp}</b>. It will expire in 30 minutes.</p>`,
        });

        res.status(200).json({ message: 'OTP sent successfully' });
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        res.status(500).json({ message });
    }
});

// -------------------- VERIFY OTP --------------------
employeeRouter.post('/verify-otp', async (req: Request, res: Response) => {
    try {
        const { email, otp } = req.body as { email: string; otp: string };
        if (!email || !otp) return res.status(400).json({ message: 'Email and OTP required' });

        const employee = await Employee.findOne({ where: { email } });
        if (!employee) return res.status(404).json({ message: 'Employee not found' });

        if (!employee.emailVerificationToken || !employee.emailVerificationExpires)
            return res.status(400).json({ message: 'No OTP sent to this email' });

        if (employee.emailVerificationExpires < new Date())
            return res.status(400).json({ message: 'OTP expired' });

        if (employee.emailVerificationToken !== otp)
            return res.status(400).json({ message: 'Invalid OTP' });

        employee.isEmailVerified = true;
        employee.emailVerificationToken = null;
        employee.emailVerificationExpires = null;
        await employee.save();

        res.status(200).json({ message: 'OTP verified successfully', employeeId: employee.employeeId });
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        res.status(500).json({ message });
    }
});

// -------------------- PROTECTED PROFILE --------------------
employeeRouter.get('/profile', protectEmployee, async (req: AuthenticatedRequest, res: Response) => {
    try {
        if (!req.employee) return res.status(404).json({ message: 'Employee not found' });
        res.status(200).json({ employee: req.employee });
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch profile' });
    }
});

// -------------------- REGISTER --------------------
employeeRouter.post('/register', async (req: Request, res: Response) => {
    try {
        const { fullname, email, role } = req.body;
        if (!fullname || !email || !role) return res.status(400).json({ message: 'All fields required' });

        const tempPassword = 'temp';
        const hashedPassword = await bcrypt.hash(tempPassword, 10);

        const employee = await Employee.create({
            fullname,
            email,
            role,
            password: hashedPassword,
        });

        res.status(201).json({ message: 'Employee registered', employee });
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        res.status(500).json({ message });
    }
});

// -------------------- LOGIN --------------------
employeeRouter.post('/login', async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ message: 'Required all fields' });

        const employee = await Employee.findOne({ where: { email } });
        if (!employee) return res.status(404).json({ message: 'Invalid Credentials' });

        const match = await bcrypt.compare(password, employee.password);
        if (!match) return res.status(404).json({ message: 'Invalid Password' });

        const token = generateToken(employee.employeeId);

        res.status(200).json({
            message: 'Login successful',
            token,
            employee: {
                employeeId: employee.employeeId,
                fullname: employee.fullname,
                email: employee.email,
                role: employee.role,
            },
        });
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        res.status(500).json({ message });
    }
});

// -------------------- UPDATE ROLE --------------------
employeeRouter.patch('/update-role', async (req: Request, res: Response) => {
    try {
        const { employeeId, role } = req.body as { employeeId: number; role: string };
        if (!employeeId || !role) return res.status(400).json({ message: 'EmployeeId and role are required' });

        const employee = await Employee.findOne({ where: { employeeId } });
        if (!employee) return res.status(404).json({ message: 'Employee not found' });

        employee.role = role;
        await employee.save();

        res.status(200).json({ message: 'Role updated successfully', employee });
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        res.status(500).json({ message });
    }
});

// -------------------- SET PASSWORD --------------------
employeeRouter.patch('/set-password', async (req: Request, res: Response) => {
    try {
        const { employeeId, password } = req.body as { employeeId: number; password: string };
        if (!employeeId || !password) return res.status(400).json({ message: 'EmployeeId and password are required' });

        const hashedPassword = await bcrypt.hash(password, 10);
        await Employee.update({ password: hashedPassword }, { where: { employeeId } });

        res.status(200).json({ message: 'Password updated successfully' });
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        res.status(500).json({ message });
    }
});

// -------------------- GET FULL PROFILE --------------------
employeeRouter.get('/profile/:employeeId', async (req: Request, res: Response) => {
    try {
        const { employeeId } = req.params;
        const fieldsParam = req.query.fields as string | undefined;
        const attributes = fieldsParam
            ? fieldsParam.split(',').map(f => f.trim())
            : [
                'employeeId', 'fullname', 'email', 'role', 'department', 'designation',
                'managerId', 'location', 'dateOfJoining', 'status', 'photoURL',
                'phone', 'address', 'dob', 'bloodGroup', 'emergencyContact'
            ];

        const employee = await Employee.findOne({ where: { employeeId }, attributes });
        if (!employee) return res.status(404).json({ message: 'Employee not found' });

        res.status(200).json({ employee });
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        res.status(500).json({ message });
    }
});

// -------------------- GET SINGLE EMPLOYEE --------------------
employeeRouter.get('/:employeeId', async (req: Request, res: Response) => {
    try {
        const { employeeId } = req.params;
        const employee = await Employee.findOne({ where: { employeeId } });
        if (!employee) return res.status(404).json({ message: 'Employee not found' });

        res.status(200).json({
            employeeId: employee.employeeId,
            fullname: employee.fullname,
            email: employee.email,
            role: employee.role,
            department: employee.department,
            designation: employee.designation,
            location: employee.location,
            dateOfJoining: employee.dateOfJoining,
            photoURL: employee.photoURL,
            phone: employee.phone,
            address: employee.address,
            dob: employee.dob,
            bloodGroup: employee.bloodGroup,
            emergencyContact: employee.emergencyContact
        });
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        res.status(500).json({ message });
    }
});

// -------------------- GET ALL EMPLOYEES --------------------
employeeRouter.get('/', async (req: Request, res: Response) => {
    try {
        const employees = await Employee.findAll();
        res.status(200).json({ message: 'Fetched all employees', employees });
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        res.status(500).json({ message });
    }
});

// -------------------- UPDATE EMPLOYEE PROFILE --------------------
employeeRouter.patch('/update-profile/:employeeId', protectEmployee, async (req, res) => {
    try {
        const {
            employeeId,
            department,
            designation,
            managerId,
            location,
            dateOfJoining,
            photoURL,
            phone,
            address,
            dob,
            bloodGroup,
            emergencyContact
        } = req.body as {
            employeeId: number;
            department?: string;
            designation?: string;
            managerId?: number;
            location?: string;
            dateOfJoining?: Date;
            photoURL?: string;
            phone?: string;
            address?: string;
            dob?: Date;
            bloodGroup?: string;
            emergencyContact?: string;
        };

        if (!employeeId) return res.status(400).json({ message: 'EmployeeId is required' });

        const employee = await Employee.findOne({ where: { employeeId } });
        if (!employee) return res.status(404).json({ message: 'Employee not found' });

        // Update fields only if they are provided
        if (department !== undefined) employee.department = department;
        if (designation !== undefined) employee.designation = designation;
        if (managerId !== undefined) employee.managerId = managerId;
        if (location !== undefined) employee.location = location;
        if (dateOfJoining !== undefined) employee.dateOfJoining = dateOfJoining;
        if (photoURL !== undefined) employee.photoURL = photoURL;
        if (phone !== undefined) employee.phone = phone;
        if (address !== undefined) employee.address = address;
        if (dob !== undefined) employee.dob = dob;
        if (bloodGroup !== undefined) employee.bloodGroup = bloodGroup;
        if (emergencyContact !== undefined) employee.emergencyContact = emergencyContact;

        await employee.save();

        res.status(200).json({ message: 'Profile updated successfully', employee });
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        res.status(500).json({ message });
    }
});



export default employeeRouter;
