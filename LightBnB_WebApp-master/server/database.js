const properties = require('./json/properties.json');
const users = require('./json/users.json');
const { Pool } = require('pg');

/// Users

const pool = new Pool ({
  user: 'vagrant',
  password: '123',
  host: 'localhost',
  database: 'lightbnb'
})

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */

const getUserWithEmail = function(email) {
  return pool
    .query(`
      SELECT * FROM users
      WHERE email = $1
    `, [email || null])
    .then(res => res.rows[0])
}
exports.getUserWithEmail = getUserWithEmail;

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */

const getUserWithId = function(id) {
  return pool.query(`
  SELECT * FROM users
  WHERE id = $1
  `, [id])
  .then(res => res.rows[0])
}
exports.getUserWithId = getUserWithId;


/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */


const addUser =  function(user) {
  const values = [user.name, user.email, user.password]
  return pool 
    .query(`
      INSERT INTO users (name, email, password)
      VALUES ($1, $2, $3)
      RETURNING *;
    `, values)
    .then(res => res.rows)
}
exports.addUser = addUser;

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function(guest_id, limit = 10) {
  return pool.query(`
    SELECT properties.*, reservations.*, AVG(rating) as average_rating
    FROM properties
    JOIN reservations ON property_id = properties.id    
    JOIN property_reviews on reservation_id = reservations.id
    WHERE reservations.guest_id = $1 AND reservations.end_date < now()::date
    GROUP BY properties.id, reservations.id 
    ORDER BY reservations.start_date
    LIMIT $2;
  `, [guest_id, limit])
  .then(res => res.rows);
}
exports.getAllReservations = getAllReservations;

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */


const getAllProperties = function(options, limit = 10) {
  const queryParams = [];

  let queryString = `
  SELECT properties.*, avg(property_reviews.rating) as average_rating
  FROM properties
  JOIN property_reviews ON properties.id = property_id
  `;
  // basic clause that exists for any or no options
  // switch the query word from WHERE to AND if there is more than one paramater
  if (options.city) {
    let queryWord;
    queryParams.push(`%${options.city}%`);
    if (queryParams.length <= 1) {
      queryWord = 'WHERE';
    } else {
      queryWord = 'AND';
    }
    queryString += `${queryWord} city LIKE $${queryParams.length} `;
  }

  if (options.owner_id) {
    let queryWord;
    queryParams.push(`%${options.owner_id}%`);
    if (queryParams.length <= 1) {
      queryWord = 'WHERE';
    } else {
      queryWord = 'AND';
    }
    queryString += `${queryWord} owner_id LIKE $${queryParams.length} `;
  }

  if (options.minimum_price_per_night) {
    let queryWord;
    queryParams.push(options.minimum_price_per_night);
    if (queryParams.length <= 1) {
      queryWord = 'WHERE';
    } else {
      queryWord = 'AND';
    }
    
    queryString += `${queryWord} cost_per_night > $${queryParams.length} `;
  }

  if (options.maximum_price_per_night) {
    let queryWord;
    queryParams.push(options.maximum_price_per_night);
    if (queryParams.length <= 1) {
      queryWord = 'WHERE';
    } else {
      queryWord = 'AND';
    }
    queryString += `${queryWord} cost_per_night < $${queryParams.length}`;
  }

  

  queryString += `
    GROUP BY properties.id 
    `;
  // this is to seperate the HAVING clause from the WHERE clause

  if (options.minimum_rating) {
    queryParams.push(options.minimum_rating);
    queryString += `HAVING avg(property_reviews.rating) > $${queryParams.length} `;
  }

  queryParams.push(limit);
  queryString += `
  ORDER BY cost_per_night
  LIMIT $${queryParams.length};
  `;

  return pool.query(queryString, queryParams)
  .then(res => res.rows);
}
exports.getAllProperties = getAllProperties;


/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function(property) {
  property.description ? property.description : 'description not added'
  const values = [
    property.owner_id,
    property.title,
    property.description,
    property.thumbnail_photo_url,
    property.cover_photo_url,
    property.cost_per_night,
    property.street,
    property.city,
    property.province,
    property.post_code,
    property.country,
    property.parking_spaces,
    property.number_of_bathrooms,
    property.number_of_bedrooms
  ];
  console.log(values)
  return pool 
    .query(`
      INSERT INTO properties (
        owner_id,
        title,
        description,
        thumbnail_photo_url,
        cover_photo_url,
        cost_per_night,
        street,
        city,
        province,
        post_code,
        country,
        parking_spaces,
        number_of_bathrooms,
        number_of_bedrooms)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      RETURNING *;
    `, values)
    .then(res => res.rows[0])
}
exports.addProperty = addProperty;
