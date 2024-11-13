// models/userModel.js
const pool = require('../config/db');

// Создать нового пользователя
const createUser = async (user) => {
    const { first_name, last_name, email, phone_num, password_hash, user_type } = user;
    const query = `
        INSERT INTO users (first_name, last_name, email, phone_num, password_hash, user_type)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *;
    `;
    const values = [first_name, last_name, email, phone_num, password_hash, user_type];
    const res = await pool.query(query, values);
    return res.rows[0];
};

// Получить пользователя по ID
const getUserById = async (userId) => {
    const query = 'SELECT * FROM users WHERE user_id = $1';
    const values = [userId];
    const res = await pool.query(query, values);
    return res.rows[0];
};

// Получить всех пользователей
const getAllUsers = async () => {
    const res = await pool.query('SELECT * FROM users');
    return res.rows;
};

// Обновить пользователя
const updateUser = async (userId, user) => {
    const { first_name, last_name, email, phone_num, password_hash, user_type } = user;
    const query = `
        UPDATE users
        SET first_name = $1, last_name = $2, email = $3, phone_num = $4, password_hash = $5, user_type = $6
        WHERE user_id = $7
        RETURNING *;
    `;
    const values = [first_name, last_name, email, phone_num, password_hash, user_type, userId];
    const res = await pool.query(query, values);
    return res.rows[0];
};

// Удалить пользователя
const deleteUser = async (userId) => {
    const query = 'DELETE FROM users WHERE user_id = $1 RETURNING *';
    const values = [userId];
    const res = await pool.query(query, values);
    return res.rows[0];
};

module.exports = {
    createUser,
    getUserById,
    getAllUsers,
    updateUser,
    deleteUser,
};