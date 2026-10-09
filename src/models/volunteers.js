import db from './db.js';

const addVolunteer = async (userId, projectId) => {
    const query = `
      INSERT INTO volunteering (user_id, project_id)
      VALUES ($1, $2)
      RETURNING user_id, project_id;
    `;

    const queryParams = [userId, projectId];
    const result = await db.query(query, queryParams);

    if (result.rows.length === 0) {
        throw new Error('Failed to add volunteer to project');
    }

    if (process.env.ENABLE_SQL_LOGGING === 'true') {
        console.log('Added new volunteer to project with ID:', result.rows[0].project_id);
    }

    return result.rows[0].user_id;

};

const removeVolunteer = async (userId, projectId) => {
    const deleteQuery = `
        DELETE FROM volunteering
        WHERE user_id = $1
        AND project_id = $2
        RETURNING user_id, project_id;
    `;
    
    const result = await db.query(deleteQuery, [userId, projectId]);

    if (result.rows.length === 0) {
        throw new Error('Failed to delete volunteer');
    }

    if (process.env.ENABLE_SQL_LOGGING === 'true') {
        console.log('Removed Volunteer from project:', result.rows[0].project_id);
    }

    return result.rows[0].project_id;
};

const getVolunteerProjects = async (userId) => {
    const query = `
      SELECT
        p.project_id,
        p.name      
      FROM projects p
      JOIN volunteering v
        ON p.project_id = v.project_id
      WHERE v.user_id = $1  
      ORDER BY p.project_date;
  `;
  
    const result = await db.query(query, [userId]);

    return result.rows;
};

const isUserVolunteering = async (userId, projectId) => {
    const query = `
      SELECT
        project_id,
        user_id
      FROM volunteering      
      WHERE user_id = $1
      AND project_id = $2;      
    `;

    const result = await db.query(query, [userId, projectId]);

    return result.rows.length > 0;
};

export {
    addVolunteer,
    removeVolunteer,
    getVolunteerProjects,
    isUserVolunteering
};