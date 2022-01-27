const Inquirer = require("inquirer");
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
    const deptQuery = `SELECT role.id, role.title, role.salary, department.dept_name AS department FROM role INNER JOIN department ON department.id = role.department_id`
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
    const deptQuery = `SELECT employee.first_name, employee.last_name, role.title, role.salary, department.dept_name AS department, employee.manager_id FROM employee JOIN role ON role.id = employee.role_id JOIN department ON role.department_id = department.id ORDER BY employee.id`
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
    var deptQuery =
    `SELECT department.id, department.dept_name
      FROM department`

  connection.query(deptQuery, function (err, res) {
    if (err) throw err;

    const deptChoices = res.map(({ id, dept_name }) => ({
      value: id, Department: `${dept_name}`
    }));

    // console.table(res);
    // console.log("Department Inserted!");

    createDepartment(deptChoices);
  });
};

function createDepartment() {

    Inquirer
      .prompt([
        {
          type: "input",
          name: "dept_name",
          message: "What is the new Department Name?"
        }, 
      ])
      .then(function (answer) {
        console.log(answer);
  
        var deptAddQuery = `INSERT INTO department SET ?`
        
        connection.query(deptAddQuery,
          {
            dept_name: answer.dept_name,
          },
          function (err, res) {
            if (err) throw err;
  
            console.table(res);
            console.log("Inserted successfully!\n");
  
            userPrompt();
          });
      });
  }

//   --------------------------------------------------------------------------------

// Create function to ADD a Role
function addRole(){
  console.log('You are now ADDING a Role');
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
    }       
])
.then(({title, salary, department_id}) => {
    connection.query(`INSERT INTO role (title, salary, department_id) VALUES ('${title}',${salary},${department_id})`);
    userPrompt;
})
  
};

// Create function to ADD an employee
function addEmployee(){
    console.log('You are now ADDING an Employee');
    Inquirer.prompt([
      {
          type: "input", 
          name: "first_name", 
          message: "Enter the new employee's first name", 
          // validate:
      },
      {
          type: "input", 
          name: "last_name", 
          message: "Enter the new employee's last name", 
          // validate:
      },
      {
          type: "input", 
          name: "role_id", 
          message: "Enter the new employee's Role ID Number (1-6) ", 
          // validate:
      },       
      {
        type: "input", 
        name: "manager_id", 
        message: "Enter the new employee's Manager ID Number (1-9) ", 
        // validate:
    }    
  ])
  .then(function (answer) {
    console.log(answer);

    var query = `INSERT INTO employee SET ?`
    // when finished prompting, insert a new item into the db with that info
    connection.query(query,
      {
        first_name: answer.first_name,
        last_name: answer.last_name,
        role_id: answer.role_id,
        manager_id: answer.manager_id,
      },
      function (err, res) {
        if (err) throw err;

        console.table(res);
        console.log("New Employee Added!\n");

        userPrompt();
      });
  })
};

// Create function to update Employee Role
function updateEmployeeRole(){
    console.log('You are now UPDATING an Employee');
    userPrompt();
};

