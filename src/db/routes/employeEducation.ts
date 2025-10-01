import express from 'express'
import { protectEmployee } from '../../middleware/authMiddleware';
import EmployeeEducation from '../models/employeeEducation';
import Employee from '../models/employee';

const employeeEducationRouter = express.Router();

employeeEducationRouter.get("/education/:employeeId", protectEmployee, async (req, res) => {
    try {
        const { employeeId } = req.params;
        const education = await EmployeeEducation.findAll({
            where: { employeeId },
            include: [{ model: Employee, as: "employee" }]
        });
        res.json({ education });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});

// -------------------- ADD EMPLOYEE EDUCATION --------------------
employeeEducationRouter.post("/education", protectEmployee, async (req, res) => {
    try {
        const { employeeId, branch, specialization, university, yearOfCompletion, cgpa } = req.body;

        if (!employeeId || !branch) {
            return res.status(400).json({ message: "employeeId and branch are required" });
        }

        const newEducation = await EmployeeEducation.create({
            employeeId,
            branch,
            specialization,
            university,
            yearOfCompletion,
            cgpa
        });

        res.status(201).json({
            message: "Education record created successfully",
            education: newEducation,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});


export default employeeEducationRouter;