import db from './db.js';

const getAllCategories = async () => {
    const query = `
        SELECT category_id, name, description
      FROM public.categories;
    `;

    const result = await db.query(query);

    return result.rows;
};

const getCategoryDetails = async (categoryId) => {
  const query = `
    SELECT category_id, name, description
    FROM categories
    WHERE category_id = $1
  `;

  const queryParams = [categoryId];
  const result = await db.query(query, queryParams);

  return result.rows[0];
};

const getAllCategoriesByServiceProject = async (projectId) => {
    const query = `
      SELECT 
        c.category_id,
        c.name,
        c.description
      FROM categories c
      JOIN project_category pc
        ON c.category_id = pc.category_id
      WHERE pc.project_id = $1;     
    `;

    const queryParams = [projectId];
    const result = await db.query(query, queryParams);

    return result.rows;
};

const assignCategoryToProject = async(categoryId, projectId) => {
    const query = `
        INSERT INTO project_category (category_id, project_id)
        VALUES ($1, $2);
    `;

    await db.query(query, [categoryId, projectId]);
}

const updateCategoryAssignments = async(projectId, categoryIds) => {
    // First, remove existing category assignments for the project
    const deleteQuery = `
        DELETE FROM project_category
        WHERE project_id = $1;
    `;
    await db.query(deleteQuery, [projectId]);

    // Next, add the new category assignments
    for (const categoryId of categoryIds) {
        await assignCategoryToProject(categoryId, projectId);
    }
}

export {getAllCategories,
        getCategoryDetails,
        getAllCategoriesByServiceProject,
        assignCategoryToProject,
        updateCategoryAssignments
};    