import Employee from "./models/employee";
import EmployeeEducation from "./models/employeeEducation";
import EmployeeExperience from "./models/employeeExperience";

async function init() {
    const isDev = false;
    await Employee.sync({ alter: isDev });
    await EmployeeEducation.sync({ alter: isDev });
    await EmployeeExperience.sync({ alter: isDev })
}

function dbInit() {
    init()
}
export default dbInit;
