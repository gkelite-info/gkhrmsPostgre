import AssignedAsset from "./models/assigned_assets";
import AssetDamage from "./models/damaged_assets";
import Employee from "./models/employee";
import EmployeeAddress from "./models/employeeAddress";
import EmployeeEducation from "./models/employeeEducation";
import EmployeeExperience from "./models/employeeExperience";
import EmployeeProfile from "./models/employeeProfile";
import FamilyDetails from "./models/familyDetails";
import RequestedAsset from "./models/requested_assets";
import Sibling from "./models/siblings";

async function init() {
    const isDev = false;
    await Employee.sync({ alter: isDev });
    await EmployeeEducation.sync({ alter: isDev });
    await EmployeeExperience.sync({ alter: isDev });
    await EmployeeProfile.sync({ alter: isDev });
    await EmployeeAddress.sync({ alter: isDev });
    await FamilyDetails.sync({ alter: isDev });
    await Sibling.sync({ alter: isDev });
    await AssignedAsset.sync({ alter: isDev });
    await AssetDamage.sync({ alter: isDev });
    await RequestedAsset.sync({ alter: isDev });
}

function dbInit() {
    init()
}
export default dbInit;
