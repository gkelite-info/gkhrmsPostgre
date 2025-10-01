import express from "express";
import { protectEmployee } from "../../middleware/authMiddleware";
import EmployeeExperience from "../models/employeeExperience";

const employeeExperienceRouter = express.Router();

employeeExperienceRouter.get("/experience/:employeeId", protectEmployee, async (req, res) => {
  try {
    const { employeeId } = req.params;
    const experiences = await EmployeeExperience.findAll({ where: { employeeId } });
    res.json({ experiences });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

employeeExperienceRouter.post("/", protectEmployee, async (req, res) => {
  try {
    const { employeeId, company, role, startDate, endDate, location } = req.body;
    if (!employeeId || !company || !role || !startDate) {
      return res.status(400).json({ message: "Required fields missing" });
    }
    const newExp = await EmployeeExperience.create({ employeeId, company, role, startDate, endDate, location });
    res.status(201).json({ message: "Experience added", experience: newExp });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

export default employeeExperienceRouter;
