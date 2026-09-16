import db from './db.js'

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
}

export {getAllProjects, getProjectsByOrganizationId, getUpcomingProjects, getProjectDetails}; 