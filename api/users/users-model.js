const db = require("../../data/dbConfig");

/**
  resolves to a user with all users that match the username
 */
function findByUsername(username) {
  return db("users").where({ username: username }).first();
}

/**
  resolves to the user { id, username } with the given userId
 */
function findById(userId) {
  return db("users").where("id", userId).first();
}

/**
  resolves to the newly inserted user { id, username, password }
 */
async function add(user) {
  const [id] = await db("users").insert(user);
  return findById(id);
}

module.exports = {
  findByUsername,
  findById,
  add,
};
