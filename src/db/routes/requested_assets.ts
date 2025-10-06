import express from 'express';
import RequestedAsset from '../models/requested_assets';

const requestedAssetsRouter = express.Router();

requestedAssetsRouter.post("/requested-assets", async (req, res) => {
    try {
        const data = req.body;
        const created = await RequestedAsset.bulkCreate(data);
        res.status(201).json({ message: "Requested assets created", data: created });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to create requested assets" });
    }
});

requestedAssetsRouter.get("/requested-assets", async (req, res) => {
    try {
        const { employeeId } = req.query;
        const whereClause: any = {};
        if (employeeId) whereClause.employeeId = employeeId;

        const data = await RequestedAsset.findAll({ where: whereClause });
        res.status(200).json(data);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch requested assets" });
    }
});


export default requestedAssetsRouter;