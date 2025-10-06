import express from 'express';
import { protectEmployee } from '../../middleware/authMiddleware';
import employeeRouter from './employee';
import employeeEducationRouter from './employeeEducation';
import employeeExperienceRouter from './employeeExperience';
import employeeProfileRouter from './employeeProfile';
import employeeAddressRouter from './employeeAddress';
import familyRouter from './familyRouter';
import employeesRouter from './employeeRoutes';
import assignedAssetsRouter from './assigned_assets';
import requestedAssetsRouter from './requested_assets';
import damagedAssetsRouter from './damaged_assets';

const routes = express.Router();

routes.use('/employee', employeeRouter);
routes.use('/employeeEducation', employeeEducationRouter);
routes.use('/employeeExperience', employeeExperienceRouter);
routes.use('/employeeProfile', employeeProfileRouter);
routes.use('/employeeAddress', employeeAddressRouter);
routes.use('/family', familyRouter);
routes.use(employeesRouter);
routes.use('/assets', assignedAssetsRouter);
routes.use('/assets', requestedAssetsRouter);
routes.use('/assets', damagedAssetsRouter);

routes.get('/profile', protectEmployee, async (req: any, res) => {
    try {
        const employee = req.employee;
        res.status(200).json({ employee });
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch profile' });
    }
});

export default routes;