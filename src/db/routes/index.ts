import express from 'express';
import { protectEmployee } from '../../middleware/authMiddleware';
import employeeRouter from './employee';

const routes = express.Router();

routes.use('/employee', employeeRouter);

routes.get('/profile', protectEmployee, async (req: any, res) => {
    try {
        const employee = req.employee;
        res.status(200).json({ employee });
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch profile' });
    }
});

export default routes;