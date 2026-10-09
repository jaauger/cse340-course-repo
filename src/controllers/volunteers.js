import { 
    addVolunteer,
    removeVolunteer    
 } from '../models/volunteers.js';

const processAddVolunteer = async (req, res) => {
    const projectId = req.params.projectId;
    const userId = req.session.user.user_id;
    
    await addVolunteer(userId, projectId);

    req.flash('success', 'Volunteering updated successfully.');
    res.redirect(`/project/${projectId}`);
};

const processRemoveVolunteer = async (req, res) => {
    const projectId = req.params.projectId;
    const userId = req.session.user.user_id;
    
    await removeVolunteer(userId, projectId);

    req.flash('success', 'Volunteering updated successfully.');

    if (req.body.redirectTo === 'dashboard') {
        return res.redirect('/dashboard');
    };

    res.redirect(`/project/${projectId}`);

};

export {
    processAddVolunteer,
    processRemoveVolunteer
};