const db = require('../data/dbConfig')

module.exports = {
    add,
    findBy,
    findById
}

async function add(user) {
    const [id] = await db('users').insert(user)
    return findById(id)
}

function findBy(filter) {
    return db('users')
        .select('id', 'username', 'password')
        .where(filter)
}

function findById(id) {
    return db('users')
        .select('id', 'username', 'password')
        .where('id', id)
        .first()
}