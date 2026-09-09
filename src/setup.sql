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


SELECT *
FROM organization;

ALTER TABLE projects
ADD COLUMN organization_id INTEGER;

ALTER TABLE projects
ADD CONSTRAINT fk_projects_organization
FOREIGN KEY (organization_id)
REFERENCES organization(organization_id);

UPDATE projects
SET organization_id = 2
WHERE name = 'Community Park Cleanup';

UPDATE projects
SET organization_id = 3
WHERE name = 'After-School Tutoring';

UPDATE projects
SET organization_id = 3
WHERE name = 'Community Food Drive';


INSERT INTO projects (name, description, organization_id)
VALUES
    -- BrightFuture Builders
    (
        'Community Home Repair Day',
        'Help repair and improve homes for families who need assistance with basic maintenance and accessibility.',
        1
    ),
    (
        'Neighborhood Accessibility Ramp Build',
        'Assist with constructing accessibility ramps to make local homes and community spaces easier to access.',
        1
    ),
    (
        'Playground Restoration Project',
        'Help repair, paint, and improve playground equipment and surrounding recreation areas.',
        1
    ),
    (
        'Community Center Renovation',
        'Support renovation and improvement projects at a local community center serving neighborhood families.',
        1
    ),
    (
        'School Improvement Day',
        'Volunteer with painting, cleanup, landscaping, and minor improvement projects at a local school.',
        1
    ),

    -- GreenHarvest Growers
    (
        'Community Garden Planting',
        'Prepare garden beds and plant fruits, vegetables, and herbs for a neighborhood community garden.',
        2
    ),
    (
        'Urban Tree Planting',
        'Plant and care for trees in neighborhoods and public spaces to improve the local environment.',
        2
    ),
    (
        'Neighborhood Compost Workshop',
        'Help residents learn how to compost food and yard waste while supporting a community composting program.',
        2
    ),
    (
        'Riverbank Restoration',
        'Remove litter and invasive plants while helping restore vegetation along a local riverbank.',
        2
    ),

    -- UnityServe Volunteers
    (
        'Senior Support Day',
        'Assist local senior residents with errands, yard work, household tasks, and friendly companionship.',
        3
    ),
    (
        'Hygiene Kit Assembly',
        'Sort donated supplies and assemble hygiene kits for individuals and families experiencing hardship.',
        3
    ),
    (
        'Family Resource Donation Drive',
        'Collect, sort, and organize clothing, household goods, and other essential items for families in need.',
        3
    );

SELECT
    o.name AS organization,
    COUNT(p.project_id) AS project_count
FROM organization o
LEFT JOIN projects p
    ON o.organization_id = p.organization_id
GROUP BY o.organization_id, o.name
ORDER BY o.organization_id;	


SELECT project_id, name, organization_id
FROM projects
ORDER BY project_id;





INSERT INTO project_category (project_id, category_id)
VALUES
    -- BrightFuture Builders
    (4, 3),  -- Community Home Repair Day → Community Service
    (5, 3),  -- Neighborhood Accessibility Ramp Build → Community Service
    (5, 4),  -- Neighborhood Accessibility Ramp Build → Health and Wellness
    (6, 3),  -- Playground Restoration Project → Community Service
    (6, 4),  -- Playground Restoration Project → Health and Wellness
    (7, 3),  -- Community Center Renovation → Community Service
    (8, 2),  -- School Improvement Day → Educational
    (8, 3),  -- School Improvement Day → Community Service

    -- GreenHarvest Growers
    (9, 1),  -- Community Garden Planting → Environmental
    (9, 2),  -- Community Garden Planting → Educational
    (10, 1), -- Urban Tree Planting → Environmental
    (11, 1), -- Neighborhood Compost Workshop → Environmental
    (11, 2), -- Neighborhood Compost Workshop → Educational
    (12, 1), -- Riverbank Restoration → Environmental
    (12, 3), -- Riverbank Restoration → Community Service

    -- UnityServe Volunteers
    (13, 3), -- Senior Support Day → Community Service
    (13, 4), -- Senior Support Day → Health and Wellness
    (14, 3), -- Hygiene Kit Assembly → Community Service
    (14, 4), -- Hygiene Kit Assembly → Health and Wellness
    (15, 3); -- Family Resource Donation Drive → Community Service


SELECT
    p.project_id,
    p.name AS project,
    o.name AS organization,
    STRING_AGG(c.name, ', ' ORDER BY c.name) AS categories
FROM projects p
JOIN organization o
    ON p.organization_id = o.organization_id
LEFT JOIN project_category pc
    ON p.project_id = pc.project_id
LEFT JOIN categories c
    ON pc.category_id = c.category_id
GROUP BY
    p.project_id,
    p.name,
    o.name
ORDER BY p.project_id;


ALTER TABLE projects
ADD COLUMN location VARCHAR(255),
ADD COLUMN project_date DATE;

SELECT *
FROM projects;

UPDATE projects
SET location = 'Riverside Community Park',
    project_date = '2026-09-19'
WHERE project_id = 1;

UPDATE projects
SET location = 'Lincoln Community Center',
    project_date = '2026-09-22'
WHERE project_id = 2;

UPDATE projects
SET location = 'UnityServe Distribution Center',
    project_date = '2026-09-26'
WHERE project_id = 3;

UPDATE projects
SET location = 'Maplewood Neighborhood',
    project_date = '2026-09-30'
WHERE project_id = 4;

UPDATE projects
SET location = 'Westside Community Center',
    project_date = '2026-10-03'
WHERE project_id = 5;

UPDATE projects
SET location = 'Meadowbrook Community Park',
    project_date = '2026-10-10'
WHERE project_id = 6;

UPDATE projects
SET location = 'Riverside Community Center',
    project_date = '2026-10-14'
WHERE project_id = 7;

UPDATE projects
SET location = 'Washington Elementary School',
    project_date = '2026-10-17'
WHERE project_id = 8;

UPDATE projects
SET location = 'GreenHarvest Community Garden',
    project_date = '2026-10-21'
WHERE project_id = 9;

UPDATE projects
SET location = 'Liberty Neighborhood Park',
    project_date = '2026-10-24'
WHERE project_id = 10;

UPDATE projects
SET location = 'GreenHarvest Education Center',
    project_date = '2026-10-28'
WHERE project_id = 11;

UPDATE projects
SET location = 'Jordan River Community Trail',
    project_date = '2026-10-31'
WHERE project_id = 12;

UPDATE projects
SET location = 'Willow Creek Senior Center',
    project_date = '2026-11-04'
WHERE project_id = 13;

UPDATE projects
SET location = 'UnityServe Volunteer Center',
    project_date = '2026-11-07'
WHERE project_id = 14;

UPDATE projects
SET location = 'UnityServe Community Warehouse',
    project_date = '2026-11-14'
WHERE project_id = 15;

ALTER TABLE projects
ALTER COLUMN location SET NOT NULL,
ALTER COLUMN project_date SET NOT NULL;