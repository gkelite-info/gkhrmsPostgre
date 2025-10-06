import express from 'express';
import AssignedAsset from '../models/assigned_assets';

const assignedAssetsRouter = express.Router();

assignedAssetsRouter.post("/assigned-assets", async (req, res) => {
    try {
        const data = req.body;
        const created = await AssignedAsset.bulkCreate(data);
        res.status(201).json({ message: "Assigned assets created", data: created });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to create assigned assets" });
    }
});

assignedAssetsRouter.get("/assigned-assets", async (req, res) => {
    try {
        const { employeeId } = req.query;
        const whereClause: any = {};
        if (employeeId) whereClause.employeeId = employeeId;

        const data = await AssignedAsset.findAll({ where: whereClause });
        res.status(200).json(data);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch assigned assets" });
    }
});


export default assignedAssetsRouter;