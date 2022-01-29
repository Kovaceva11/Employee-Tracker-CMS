const Inquirer = require("inquirer");
const mySQL = require("mysql2");
require('dotenv').config();
const CFonts = require('cfonts');

CFonts.say('Employee Tracker', {
	font: 'block',              // define the font face
	align: 'left',              // define text alignment
	colors: ['white'],         // define all colors
	background: 'transparent',  // define the background color, you can also use `backgroundColor` here as key
	letterSpacing: 1,           // define letter spacing
	lineHeight: 1,              // define the line height
	space: true,                // define if the output text should have empty lines on top and on the bottom
	maxLength: '0',             // define how many character can be on one line
	gradient: ['cyan', 'green'],            // define your two gradient colors
	independentGradient: true, // define if you want to recalculate the gradient for each new line
	transitionGradient: true,  // define if this is a transition between colors directly
	env: 'node'                 // define the environment CFonts is being executed in
});

var connection = mySQL.createConnection({
  host: "localhost",
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// connect to the mysql server and sql database
connection.connect(function (err) {
  if (err) throw err;
  // run the start function after the connection is made to prompt the user
  userPrompt();
});

// This method prompts the user for the next employee and ends when all employees have been entered.
function userPrompt() {
  Inquirer.prompt([
    {
      type: "list",
      name: "userSelection",
      message: "Main Menu",
      loop: false,
      choices: [
        "View all departments",
        "View all roles",
        "View all employees",
        "Add a department",
        "Add a role",
        "Add an employee",
        "Update an employee's role",
        "Exit this application",
      ],
    },
  ]).then(function ({ userSelection }) {
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
function viewAllDepartments() {
  console.log("You are now viewing ALL Departments");

  const deptQuery = `SELECT * FROM department`;
  connection.query(deptQuery, function (err, res) {
    if (err) throw err;
    console.table(res);
    console.log("Departments Showing!\n");
    userPrompt();
  });
}

// Create function to view all roles
function viewAllRoles() {
  console.log("You are now viewing ALL Roles");
  const roleQuery = `SELECT role.id, role.title, role.salary, department.dept_name AS department FROM role INNER JOIN department ON department.id = role.department_id`;
  connection.query(roleQuery, function (err, res) {
    if (err) throw err;
    console.table(res);
    console.log("Roles Showing!\n");
    userPrompt();
  });
}

// Create function to view all employees
function viewAllEmployees() {
  console.log("You are now viewing ALL Employees");
  const employeeQuery = `SELECT employee.first_name, employee.last_name, role.title, role.salary, department.dept_name AS department, employee.manager_id FROM employee JOIN role ON role.id = employee.role_id JOIN department ON role.department_id = department.id ORDER BY employee.id`;
  connection.query(employeeQuery, function (err, res) {
    if (err) throw err;
    console.table(res);
    console.log("Employees Showing!\n");
    userPrompt();
  });
}

// Create function to ADD a department
function addDepartment() {
  console.log("You are now ADDING a Department");
  var deptQuery = `SELECT * FROM department`;

  connection.query(deptQuery, function (err, res) {
    if (err) throw err;

    const availableDepartments = res.map(({ id, dept_name }) => ({
      value: id,
      Department: `${dept_name}`,
    }));

    createDepartment(availableDepartments);
  });
}

function createDepartment() {
  Inquirer.prompt([
    {
      type: "input",
      name: "dept_name",
      message: "What is the new Department Name?",
    },
  ]).then(function (answer) {
    console.log(answer);

    var deptAddQuery = `INSERT INTO department SET ?`;

    connection.query(
      deptAddQuery,
      {
        dept_name: answer.dept_name,
      },
      function (err, res) {
        if (err) throw err;

        console.table(res);
        console.log("Inserted successfully!\n");

        userPrompt();
      }
    );
  });
}
// Create function to ADD a Role
function addRole() {
  console.log("You are now ADDING a Role");
  Inquirer.prompt([
    {
      type: "input",
      name: "title",
      message: "Enter new Job Title",
      // validate:
    },
    {
      type: "input",
      name: "salary",
      message: "Enter the salary",
      // validate:
    },
    {
      type: "input",
      name: "department_id",
      message: "Enter the ID# of the new Job's Department",
      // validate:
    },
  ]).then(({ title, salary, department_id }) => {
    const roleQuery = `INSERT INTO role (title, salary, department_id) VALUES ('${title}',${salary},${department_id})`;
    connection.query(roleQuery, function (err, res) {
      if (err) throw err;

      console.table(res);
      console.log("A new Role has been added!\n");

      userPrompt();
    });
  });
}

// Create function to ADD an employee
function addEmployee() {
  console.log("You are now ADDING an Employee");
  Inquirer.prompt([
    {
      type: "input",
      name: "first_name",
      message: "Enter the new employee's first name",
      validate: first_name => {
        if(first_name) {
            return true;
        } else {
            console.log("Must enter First Name")
            return false;
        }
    }
    },
    {
      type: "input",
      name: "last_name",
      message: "Enter the new employee's last name",
      validate: last_name => {
        if(last_name) {
            return true;
        } else {
            console.log("Must enter Last Name")
            return false;
        }
    }
    },
    {
      type: "input",
      name: "role_id",
      message: "Enter the new employee's Role ID Number (1-6) ",
      validate: role_id => {
        if (isNaN(role_id)) {
            console.log("Please enter a number for the Role's ID!")
            return false;
        } else if (!role_id) {
            console.log("Please enter a number for the Role's ID!")
            return false;
        } else {
            return true;
        }
    }
    },
    {
      type: "input",
      name: "manager_id",
      message: "Enter the new employee's Manager ID Number (1-9) ",
      validate: manager_id => {
        if (isNaN(manager_id)) {
            console.log("Please enter a number between 1-9 for the Manager's ID!")
            return false;
        } else if (!manager_id) {
            console.log("Please enter a number between 1-9 for the Manager's ID!")
            return false;
        } else {
            return true;
        }
    }
    },
  ]).then(({ first_name, last_name, role_id, manager_id }) => {
    const employeeQuery = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('${first_name}','${last_name}','${role_id}', '${manager_id}')`;
    connection.query(employeeQuery, function (err, res) {
      if (err) throw err;

      console.table(res);
      console.log("A new Employee has been added!\n");

      userPrompt();
    });
  });
}

// Create function to update Employee Role. Create function for passing Employee and Role to list choices. Then use UPDATE, SET, WHERE.
function updateEmployeeRole() {
  selectEmployees();
}

function selectEmployees() {
  console.log("Updating an employee");

  var selectEmployeesQuery = `SELECT * from employee`;

  connection.query(selectEmployeesQuery, function (err, res) {
    if (err) throw err;

    const employeeList = res.map(({ id, first_name, last_name }) => ({
      value: id,
      name: `${first_name} ${last_name}`,
    }));

    console.table(res);
    console.log("selectEmployees To Update!\n");

    selectRole(employeeList);
  });
}

function selectRole(employeeList) {
  console.log("Updating a role");

  var selectRolesQuery = `SELECT * FROM role`;
  let roleList;

  connection.query(selectRolesQuery, function (err, res) {
    if (err) throw err;

    roleList = res.map(({ id, title, salary }) => ({
      value: id,
      title: `${title}`,
      salary: `${salary}`,
    }));

    console.table(res);
    console.log("selectRole to Update!\n");

    promptUpdateEmployee(employeeList, roleList);
  });
}

function promptUpdateEmployee(employeeList, roleList) {
  Inquirer.prompt([
    {
      type: "list",
      name: "employee_id",
      message: "Which employee do you want to set with the role?",
      choices: employeeList,
    },
    {
      type: "list",
      name: "role_id",
      message: "Which role do you want to update?",
      choices: roleList,
    },
  ]).then(function (answer) {
    var employeeRoleQuery = `UPDATE employee SET role_id = ? WHERE id = ?`;    
    connection.query(
      employeeRoleQuery,
      [answer.role_id, answer.employee_id],
      function (err, res) {
        if (err) throw err;

        console.table(res);
        console.log("Employee Role Updated!");

        userPrompt();
      }
    );    
  });}