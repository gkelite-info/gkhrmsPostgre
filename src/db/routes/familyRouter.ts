import express, { Request, Response } from "express";
import FamilyDetails from "../models/familyDetails";
import Sibling from "../models/siblings";

const familyRouter = express.Router();

// familyRouter.get("/:employeeId", async (req: Request, res: Response) => {
//   try {
//     const { employeeId } = req.params;

//     const family = await FamilyDetails.findOne({ where: { employeeId } });
//     const siblings = await Sibling.findAll({ where: { employeeId } });

//     res.json({ family, siblings });
//   } catch (err) {
//     res.status(500).json({ message: "Internal Server Error", error: err });
//   }
// });

familyRouter.get("/:employeeId", async (req: Request, res: Response) => {
    try {
        const { employeeId } = req.params;

        // Only select relevant fields for frontend
        const family = await FamilyDetails.findOne({
            where: { employeeId },
            attributes: [
                "spouseName",
                "spouseDOB",
                "spouseGender",
                "fatherName",
                "fatherDOB",
                "fatherAge",
                "fatherMobile",
                "fatherProfession",
                "fatherGender",
                "motherName",
                "motherDOB",
                "motherAge",
                "motherMobile",
                "motherProfession",
                "motherGender",
                "willingToOPT",
            ],
        });

        const siblings = await Sibling.findAll({
            where: { employeeId },
            attributes: ["name", "dob", "gender"],
        });

        res.json({ family, siblings });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal Server Error", error: err });
    }
});

familyRouter.post("/", async (req: Request, res: Response) => {
    try {
        const { employeeId, family, siblings } = req.body;

        if (!employeeId || !family) {
            return res
                .status(400)
                .json({ message: "EmployeeId and family details are required" });
        }

        const [familyRecord] = await FamilyDetails.upsert({
            employeeId,
            ...family,
        });

        let siblingRecords: Sibling[] = [];
        if (siblings && Array.isArray(siblings)) {
            await Sibling.destroy({ where: { employeeId } });

            siblingRecords = await Sibling.bulkCreate(
                siblings.map((s: any) => ({ employeeId, ...s }))
            );
        }

        res.status(201).json({
            message: "Family data saved successfully",
            family: familyRecord,
            siblings: siblingRecords,
        });
    } catch (err) {
        console.error("Error saving family data:", err);
        res.status(500).json({ message: "Internal Server Error", error: err });
    }
});

export default familyRouter;
