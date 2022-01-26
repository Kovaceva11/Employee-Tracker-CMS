INSERT INTO department (dept_name)
VALUES 
    ('Sales'),
    ('Engineering'),
    ('Finance'),
    ('Legal'),
    ('Customer Service'),
    ('Senior Management');

INSERT INTO role (title, salary, department_id)
VALUES 
    ('Sales Manager', 80000, 1),
    ('Engineering Manager', 100000, 2),
    ('Account Manager', 70000, 3),
    ('Chief Operating Officer', 250000, 6),
    ('Finance Manager', 105000, 3),
    ('Accountant', 85000, 3),
    ('Legal Aide', 50000, 4),
    ('Customer Service', 55000, 5),
    ('Software Engineer', 120000, 2);


INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
    ('Adam', 'Kovacevich', 4, NULL),
    ('John', 'Doe', 1, NULL),
    ('Jane', 'Smith', 2, NULL),
    ('Jack', 'Sparrow', 9, 2),
    ('Hunter', 'Thompson', 8, 1),
    ('James', 'Bond', 3, 3),
    ('John', 'Rambo', 5, NULL),
    ('Wonder', 'Woman', 6, 7),
    ('Gal', 'Gadot', 7, 4)