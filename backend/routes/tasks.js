const express = require('express');
const debug = require('debug')('backend:routes-tasks');

const router = express.Router();

// Models
const {
    addTask
} = require('../models/tasks')

// Middlewares
const { authJWT } = require('../middlewares/auth');

// Constants
const { task: taskErrorMessages } = require('../constants/error-messages');

router.post('/add-task', authJWT, async (req, res)=>{
    const { id, title, description } = req.body;
    const { id: userId } = req.user;

    if (!title){
        return res.status(400).json({ title: null, description: null, error_message: taskErrorMessages.MISSING_TITLE });
    }

    if (!description){
        return res.status(400).json({ title: null, description: null, error_message: taskErrorMessages.MISSING_DESCRIPTION});
    }

    try {
        const taskId = await addTask(title, description, userId, id);

        return res.json({ title: taskId, error_message: null});
    } catch (err) {
        debug(err);
        return res.status(403).json({ title: null, error_message: err});
    }
});

module.exports = router;