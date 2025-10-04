import express from 'express'
import EmployeeAddress from '../models/employeeAddress';
import { protectEmployee } from '../../middleware/authMiddleware';


const employeeAddressRouter = express.Router();


employeeAddressRouter.post("/addresses/:employeeId", async (req, res) => {
    try {
        const { employeeId } = req.params;
        const { currentAddress, permanentAddress } = req.body;

        if (!employeeId) {
            return res.status(400).json({ message: "employeeId required" });
        }

        if (currentAddress) {
            await EmployeeAddress.upsert({
                ...currentAddress,
                employeeId,
                type: "Current"
            });
        }

        if (permanentAddress) {
            await EmployeeAddress.upsert({
                ...permanentAddress,
                employeeId,
                type: "Permanent"
            });
        }

        res.status(201).json({ message: "Addresses saved successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

employeeAddressRouter.get("/addresses/:employeeId", async (req, res) => {
  try {
    const { employeeId } = req.params;
    const addresses = await EmployeeAddress.findAll({
      where: { employeeId: parseInt(employeeId) }
    });

    res.status(200).json({ addresses });
  } catch (err) {
    console.error("Error fetching addresses:", err);
    res.status(500).json({ message: "Internal Server error" });
  }
});



export default employeeAddressRouter;
