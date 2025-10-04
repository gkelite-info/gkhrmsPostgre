import { Router } from 'express';
import Employee from '../models/employee';
import upload from '../../middleware/upload';

const employeesRouter = Router();

const uploadProfilePhoto = async (req: any, res: any) => {
  const { employeeId } = req.params;

  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded.' });
  }

  const fullPathFromFileSystem = req.file.path;

  const normalizedPath = fullPathFromFileSystem.replace(/\\/g, '/');
  const staticRootName = 'uploads/';
  let relativePathForDB = normalizedPath;
  
  const startIndex = normalizedPath.indexOf(staticRootName);

  if (startIndex !== -1) {
    relativePathForDB = normalizedPath.substring(startIndex + staticRootName.length);
  } 

  try {
    const employee = await Employee.findByPk(employeeId);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found.' });
    }

    await employee.update({ photoURL: relativePathForDB });

    res.status(200).json({
      message: 'Profile photo uploaded successfully',
      photoURL: relativePathForDB
    });
  } catch (error) {
    console.error('Database update error:', error);
    res.status(500).json({ message: 'Failed to update employee photoURL.' });
  }
};

employeesRouter.post('/employees/:employeeId/photo', 
    upload.single('profile_photo'),
    uploadProfilePhoto
);

employeesRouter.get('/employees/:employeeId/photo', async (req, res) => {
  const { employeeId } = req.params;
  try {
    const employee = await Employee.findByPk(employeeId);
    if (!employee || !employee.photoURL) {
      return res.status(404).json({ message: 'Employee or photo not found.' });
    }

    
    const photoPath = `/uploads/${employee.photoURL}`;
    res.status(200).json({ photoURL: photoPath });

  } catch (error) {
    console.error('Error fetching employee photo:', error);
    res.status(500).json({ message: 'Failed to fetch employee photo.' });
  }
});

export default employeesRouter;