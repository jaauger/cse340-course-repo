import express from 'express';

import { showHomePage } from './controllers/index.js';

import { showProjectsPage,
         showProjectDetailsPage,
         showNewProjectForm,
         processNewProjectForm,
         projectValidation,
         showEditProjectForm,
         processEditProjectForm
} from './controllers/projects.js';

import { showCategoriesPage,
         showCategoryDetailsPage,
         showAssignCategoriesForm,
         processAssignCategoriesForm,
         showNewCategoryForm,
         showEditCategoryForm,
         processNewCategoryForm,
         processEditCategoryForm,
         categoryValidation
} from './controllers/categories.js';

import {
    showOrganizationsPage,
    showOrganizationDetailsPage,
    showNewOrganizationForm,
    processNewOrganizationForm,
    organizationValidation,
    showEditOrganizationForm,
    processEditOrganizationForm
} from './controllers/organizations.js';

import { testErrorPage } from './controllers/errors.js';

import { showUserRegistrationForm,
         processUserRegistrationForm,
         showLoginForm,
         processLoginForm,
         processLogout,
         requireLogin,
         showDashboard,
         requireRole
} from './controllers/users.js';

const router = express.Router();

router.get('/', showHomePage);
router.get('/organizations', showOrganizationsPage);
router.get('/organization/:id', showOrganizationDetailsPage);
router.get('/new-organization', requireRole('admin'), showNewOrganizationForm);
router.get('/edit-organization/:id', requireRole('admin'), showEditOrganizationForm);

router.get('/projects', showProjectsPage);
router.get('/project/:id', showProjectDetailsPage);
router.get('/new-project', requireRole('admin'), showNewProjectForm);
router.get('/assign-categories/:projectId', requireRole('admin'), showAssignCategoriesForm);
router.get('/edit-project/:id', requireRole('admin'), showEditProjectForm);

router.get('/categories', showCategoriesPage);
router.get('/category/:id', showCategoryDetailsPage);
router.get('/new-category', requireRole('admin'), showNewCategoryForm);
router.get('/edit-category/:id', requireRole('admin'), showEditCategoryForm);

router.get('/dashboard', requireLogin, showDashboard);

router.get('/register', showUserRegistrationForm);

router.get('/login', showLoginForm);

router.get('/logout', processLogout);

// Route to handle new organization form submission
router.post('/new-organization', requireRole('admin'), organizationValidation, processNewOrganizationForm);
router.post('/edit-organization/:id', requireRole('admin'), organizationValidation, processEditOrganizationForm);
router.post('/new-project', requireRole('admin'), projectValidation, processNewProjectForm);
router.post('/assign-categories/:projectId', requireRole('admin'), processAssignCategoriesForm);
router.post('/edit-project/:id', requireRole('admin'), projectValidation, processEditProjectForm);
router.post('/new-category', requireRole('admin'), categoryValidation, processNewCategoryForm);
router.post('/edit-category/:id', requireRole('admin'), categoryValidation, processEditCategoryForm);
router.post('/register', processUserRegistrationForm);
router.post('/login', processLoginForm);


// error-handling routes
router.get('/test-error', testErrorPage);

export { router };