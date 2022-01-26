const Inquirer = require("inquirer");
const { DEC8_BIN } = require("mysql/lib/protocol/constants/charsets");
const mySQL = require("mysql2");

var connection = mySQL.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "employeesDB"
  });
  
  // connect to the mysql server and sql database
  connection.connect(function (err) {
    if (err) throw err;
    // run the start function after the connection is made to prompt the user
    userPrompt();
  });

// This method prompts the user for the next employee and ends when all employees have been entered.
function userPrompt() {
     Inquirer.prompt([{
        type: "list", 
        name: "userSelection", 
        message: "What would you like to do?",
        loop: false, 
        choices: [  "View all departments", 
                    "View all roles", 
                    "View all employees", 
                    "Add a department", 
                    "Add a role", 
                    "Add an employee", 
                    "Update an employee's role",                     
                    "Exit this application",
                ]        
    }])
    .then(function({userSelection})  {
        switch (userSelection) {
            case "View all departments": {
                viewAllDepartments();
                break;
            }
            case "View all roles": {
                viewAllRoles();
                break;
            }
            case "View all employees": {
                viewAllEmployees();
                break;
            }
            case "Add a department": {
                addDepartment();
                break;
            }
            case "Add a role": {
                addRole();
                break;
            }
            case "Add an employee": {
                addEmployee();
                break;
            }
            case "Update an employee's role": {
                updateEmployeeRole();
                break;
            }
            case "Exit this application": {
                console.log("You have now exited the application. Thank you.");
                connection.end();
                break;    
            }
            //Default to Exit Application.
            default: {
                console.log("Defaulted Exit. Thank you.");
                connection.end();
                break;                
            }
        }
        
    });
}
// Query Functions Below
// Create function to view all departments
function viewAllDepartments(){
   console.log('You are now viewing ALL Departments');

   const deptQuery = `SELECT * FROM department`
   connection.query(deptQuery, function (err,res) {
       if (err) throw err;
       console.table(res);
       console.log("Departments Showing!\n");
       userPrompt();
   });
};

// Create function to view all roles
function viewAllRoles(){
    console.log('You are now viewing ALL Roles');
    const deptQuery = `SELECT * FROM role`
   connection.query(deptQuery, function (err,res) {
       if (err) throw err;
       console.table(res);
       console.log("Roles Showing!\n");
       userPrompt();
   });
};

// Create function to view all employees
function viewAllEmployees(){
    console.log('You are now viewing ALL Employees');
    const deptQuery = `SELECT * FROM employee`
   connection.query(deptQuery, function (err,res) {
       if (err) throw err;
       console.table(res);
       console.log("Employees Showing!\n");
       userPrompt();
   });
};

// Create function to ADD a department
function addDepartment(){
    console.log('You are now ADDING a Department');
    userPrompt();
};

// Create function to ADD a Role
function addRole(){
    console.log('You are now ADDING a Role');
    userPrompt();
};

// Create function to ADD an employee
function addEmployee(){
    console.log('You are now ADDING an Employee');
    userPrompt();
};

// Create function to update Employee Role
function updateEmployeeRole(){
    console.log('You are now UPDATING an Employee');
    userPrompt();
};