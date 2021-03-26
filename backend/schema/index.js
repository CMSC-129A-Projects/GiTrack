const assignees = require('./assignees');
const boards = require('./boards');
const branches = require('./branches');
const columns = require('./columns');
const memberships = require('./memberships');
const repositories = require('./repositories');
const tasks = require('./tasks');
const users = require('./users');

module.exports = [
  assignees,
  boards,
  branches,
  columns,
  memberships,
  repositories,
  tasks,
  users,
];
