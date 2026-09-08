CREATE TABLE organization (
	organization_id SERIAL PRIMARY KEY,
	name VARCHAR(150) NOT NULL,
	description TEXT NOT NULL,
	contact_email VARCHAR(255) NOT NULL,
	logo_filename VARCHAR(255) NOT NULL
	);

INSERT INTO organization (name, description, contact_email, logo_filename)
VALUES
	('BrightFuture Builders', 'A nonprofit focused on improving community infrastructure through sustainable construction projects.', 'info@brightfuturebuilders.org', 'brightfuture-logo.png'),
	('GreenHarvest Growers', 'An urban farming collective promoting food sustainability and education in local neighborhoods.', 'contact@greenharvest.org', 'greenharvest-logo.png'),
	('UnityServe Volunteers', 'A volunteer coordination group supporting local charities and service initiatives.', 'hello@unityserve.org', 'unityserve-logo.png')
	;

SELECT *
FROM organization;

CREATE TABLE categories (
	category_id SERIAL PRIMARY KEY,
	name VARCHAR(150) NOT NULL,
	description TEXT NOT NULL
);

INSERT INTO categories (name, description)
VALUES
	('Environmental', 'Help protect and improve parks, trails, waterways, and other natural resources.'),
	('Educational', 'Support learning through tutoring, mentoring, and other educational opportunities.'),
	('Community Service', 'Strengthen communities by helping individuals, families, and local organizations.'),
	('Health and Wellness', 'Support projects that promote healthier individuals and stronger communities.')
	;

SELECT *
FROM categories;

CREATE TABLE projects (
	project_id SERIAL PRIMARY KEY,
	name VARCHAR (150) NOT NULL,
	description TEXT NOT NULL
);

INSERT INTO projects (name, description)
VALUES
	('Community Park Cleanup', 'Help improve local parks and public spaces through cleanup and conservation efforts.'),
	('After-School Tutoring', 'Support students with reading, homework, and educational mentoring.'),
	('Community Food Drive', 'Help collect and organize food donations for individuals and families in need.')
	;

ALTER TABLE categories
ADD CONSTRAINT uq_categories_name UNIQUE (name);

CREATE TABLE project_category (
    project_id INTEGER NOT NULL,
    category_id INTEGER NOT NULL,

    CONSTRAINT pk_project_category
        PRIMARY KEY (project_id, category_id),

    CONSTRAINT fk_project_category_project
        FOREIGN KEY (project_id)
        REFERENCES projects(project_id),

    CONSTRAINT fk_project_category_category
        FOREIGN KEY (category_id)
        REFERENCES categories(category_id)
);

INSERT INTO project_category (project_id, category_id)
VALUES
    (1, 1), -- Community Park Cleanup → Environmental
    (1, 3), -- Community Park Cleanup → Community Service

    (2, 2), -- After-School Tutoring → Educational
    (2, 3), -- After-School Tutoring → Community Service

    (3, 3), -- Community Food Drive → Community Service
    (3, 4); -- Community Food Drive → Health and Wellness

SELECT
    p.name AS project,
    c.name AS category
FROM project_category pc
JOIN projects p
    ON pc.project_id = p.project_id
JOIN categories c
    ON pc.category_id = c.category_id
ORDER BY p.name, c.name;	
