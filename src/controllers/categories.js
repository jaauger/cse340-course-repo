import { getAllCategories, getCategoryDetails } from '../models/categories.js';
import { getProjectsByCategory } from '../models/projects.js';

const showCategoriesPage = async (req, res) => {
    const categories = await getAllCategories();
    const title = 'Service Project Categories';
    
    res.render('categories', { title, categories  });
};

const showCategoryDetailsPage = async (req, res) => {
    const categoryId = req.params.id;

    const category = await getCategoryDetails(categoryId);
    const projects = await getProjectsByCategory(categoryId);
    const title = category.name;


    res.render('category', { title, category, projects });
};

export { showCategoriesPage, showCategoryDetailsPage };