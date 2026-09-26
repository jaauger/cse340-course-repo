import db from './db.js';

const getAllProjects = async () => {
  const query = `
    SELECT
      p.project_id,
      p.name,
      p.description,
      p.location,
      p.project_date,
      o.name AS organization_name
    FROM projects p
    JOIN organization o
      ON p.organization_id = o.organization_id
    ORDER BY p.project_date;
  `;

  const result = await db.query(query);

  return result.rows;
};

const getProjectsByOrganizationId = async (organizationId) => {
      const query = `
        SELECT
          project_id,
          organization_id,
          name,
          description,
          location,
          project_date
        FROM projects
        WHERE organization_id = $1
        ORDER BY project_date;
      `;
      
      const queryParams = [organizationId];
      const result = await db.query(query, queryParams);

      return result.rows;
};

const getUpcomingProjects = async (number_of_projects) => {
  const query = `
      SELECT
        p.project_id,
        p.name AS title, 
        p.description,
        p.project_date AS date,
        p.location,
        p.organization_id,
        o.name AS organization_name
      FROM projects p
      JOIN organization o
        ON p.organization_id = o.organization_id
      WHERE p.project_date >= CURRENT_DATE        
      ORDER BY p.project_date
      LIMIT $1;
      `;

  const queryParams = [number_of_projects];
  const result = await db.query(query, queryParams)
  return result.rows;    
};

const getProjectDetails = async (project_id) => {
  const query = `
      SELECT 
        p.project_id,
        p.name AS title,
        p.description,
        p.project_date AS date,
        p.location,
        p.organization_id,
        o.name AS organization_name
      FROM projects p
      JOIN organization o
        ON p.organization_id = o.organization_id
      WHERE p.project_id = $1
      ORDER BY p.project_date;    
  `;
  const queryParams = [project_id];
  const result = await db.query(query, queryParams);

  return result.rows[0]; 
};

const getProjectsByCategory = async (categoryId) => {
  const query = `
    SELECT
      p.project_id,
      p.name AS title,
      p.description,
      p.location,
      p.project_date
    FROM projects p
    JOIN project_category pc
      ON p.project_id = pc.project_id
    WHERE pc.category_id = $1 
    ORDER BY p.project_date;  
  `;
  
  const queryParams = [categoryId];
  const result = await db.query(query, queryParams);

  return result.rows;
}

const createProject = async (title, description, location, date, organizationId) => {
    const query = `
      INSERT INTO projects (name, description, location, project_date, organization_id)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING project_id;
    `;

    const queryParams = [title, description, location, date, organizationId];
    const result = await db.query(query, queryParams);

    if (result.rows.length === 0) {
        throw new Error('Failed to create project');
    }

    if (process.env.ENABLE_SQL_LOGGING === 'true') {
        console.log('Created new project with ID:', result.rows[0].project_id);
    }

    return result.rows[0].project_id;
}

const updateProject = async (projectId, name, description, project_date, location, organizationId) => {
  const query = `
    UPDATE projects 
    SET name = $1,
        description = $2,
        project_date = $3,
        location = $4,
        organization_id = $5
    WHERE project_id = $6
    RETURNING project_id;
  `;

  const queryParams = [name, description, project_date, location, organizationId, projectId];
  const result = await db.query(query, queryParams);

  if (result.rows.length === 0) {
    throw new Error('Project not found');
  }

  if (process.env.ENABLE_SQL_LOGGING === 'true') {
    console.log('Updated Project with ID:', projectId);
  }

  return result.rows[0].project_id;
}

export {getAllProjects,
        getProjectsByOrganizationId, 
        getUpcomingProjects,
        getProjectDetails, 
        getProjectsByCategory,
        createProject,
        updateProject
}; 