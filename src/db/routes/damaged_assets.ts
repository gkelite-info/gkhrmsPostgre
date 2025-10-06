import express from 'express';
import AssetDamage from '../models/damaged_assets';

const damagedAssetsRouter = express.Router();

damagedAssetsRouter.post("/asset-damages", async (req, res) => {
    try {
        const data = req.body;
        const created = await AssetDamage.bulkCreate(data);
        res.status(201).json({ message: "Asset damages created", data: created });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to create asset damages" });
    }
});

damagedAssetsRouter.get("/asset-damages", async (req, res) => {
    try {
        const { employeeId } = req.query;
        const whereClause: any = {};
        if (employeeId) whereClause.employeeId = employeeId;

        const data = await AssetDamage.findAll({ where: whereClause });
        res.status(200).json(data);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch asset damages" });
    }
});


export default damagedAssetsRouter;