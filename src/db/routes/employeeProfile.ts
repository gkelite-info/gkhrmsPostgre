import express from "express";
import { protectEmployee } from "../../middleware/authMiddleware";
import EmployeeProfile from "../models/employeeProfile";

const employeeProfileRouter = express.Router();

// -------------------- GET Employee Profile --------------------
employeeProfileRouter.get("/:employeeId", protectEmployee, async (req, res) => {
    try {
        const { employeeId } = req.params;
        const profile = await EmployeeProfile.findOne({ where: { employeeId } });

        if (!profile) {
            return res.status(404).json({ message: "Profile not found" });
        }

        res.json({ employee: profile });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});

// -------------------- CREATE / POST Employee Profile --------------------
employeeProfileRouter.post("/", protectEmployee, async (req, res) => {
    try {
        const { employeeId, aboutMe, professionalSummary, whatILove, strengths, passions } = req.body;

        if (!employeeId) return res.status(400).json({ message: "employeeId is required" });

        const newProfile = await EmployeeProfile.create({
            employeeId,
            aboutMe: aboutMe || "",
            professionalSummary: professionalSummary || "",
            whatILove: whatILove || "",
            strengths: strengths || "",
            passions: passions || ""
        });

        res.status(201).json({ message: "Profile created", profile: newProfile });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});

// -------------------- UPDATE Employee Profile --------------------
employeeProfileRouter.patch("/:employeeId", protectEmployee, async (req, res) => {
    try {
        const { employeeId } = req.params;
        const { aboutMe, professionalSummary, whatILove, strengths, passions } = req.body;

        const profile = await EmployeeProfile.findOne({ where: { employeeId } });
        if (!profile) return res.status(404).json({ message: "Profile not found" });

        if (aboutMe !== undefined) profile.aboutMe = aboutMe;
        if (professionalSummary !== undefined) profile.professionalSummary = professionalSummary;
        if (whatILove !== undefined) profile.whatILove = whatILove;
        if (strengths !== undefined) profile.strengths = strengths;
        if (passions !== undefined) profile.passions = passions;

        await profile.save();

        res.json({ message: "Profile updated", profile });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});

export default employeeProfileRouter;
