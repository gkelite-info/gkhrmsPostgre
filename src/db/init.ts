import Employee from "./models/employee";

async function init() {
    const isDev = false;
    await Employee.sync({ alter: isDev });
}

function dbInit() {
    init()
}
export default dbInit;
