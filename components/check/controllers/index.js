const createCheck = require('./create-check');
const editCheck = require('./edit-check');
const toggleCheck = require('./toggle-check');
const deleteCheck = require('./delete-check');
const deleteAllCheck = require('./delete-all');
const checkById = require('./get-by-id');
const checkByName = require('./get-by-name');
const allChecks = require('./get-all');
const checksByTag = require('./get-by-tag');
const deleteByTagName = require('./delete-by-tag');

module.exports = {
    createCheck,
    checkById,
    checkByName,
    allChecks,
    checksByTag,
    editCheck,
    toggleCheck,
    deleteCheck,
    deleteAllCheck,
    deleteByTagName
};
