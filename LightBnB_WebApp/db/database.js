const { Pool } = require("pg");

const pool = new Pool({
  user: "labber",
  password: "labber",
  host: "localhost",
  database: "lightbnb"
});


pool.query(`SELECT title FROM properties LIMIT 10;`)
  .then(response => {
    console.log(response);
  })
  .catch(error => {
    console.error(error);
  });


const properties = require("./json/properties.json");
const users = require("./json/users.json");


/// Users

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithEmail = function (email) {
  const queryStr = `
   SELECT *
   FROM users
   WHERE email = $1
  `
  const queryParams = [email];
  
  return pool.query(queryStr, queryParams)
    .then((results) => {
      if (results.rows.length === 0) {
      return null;
      }
      else {
        return results.rows[0]
      }
    })
    .catch((err) => {
      console.log(err)
    })
};

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = function (id) {
  const queryStr = `
    SELECT *
    FROM users
    WHERE id = $1
  `
  const queryParams = [id];
  
  return pool.query(queryStr, queryParams)
    .then((results) => {
      if (results.rows.length === 0) {
      return null;
      }
      else {
        return results.rows[0]
      }
    })
    .catch((err) => {
      console.log(err)
    })
};

/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser = function (user) {

const queryStr = 
`INSERT INTO users (name, email, password)
VALUES ($1, $2, $3)
RETURNING *;
`

const queryParams = [user.name, user.email, user.password];

return pool.query(queryStr, queryParams)
.then((results) => {
  return results.rows[0]
})
.catch((err) => {
  console.log("error: ", err)
});

};

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function (guest_id, limit = 10) {

  const queryStr = 
  `SELECT reservations.id, properties.title, properties.cost_per_night, reservations.start_date, avg(rating) as average_rating
  FROM reservations
  JOIN properties ON reservations.property_id = properties.id
  JOIN property_reviews ON properties.id = property_reviews.property_id
  WHERE reservations.guest_id = $1
  GROUP BY properties.id, reservations.id
  ORDER BY reservations.start_date;
  `
  const queryParams = [guest_id]

  return pool.query(queryStr, queryParams)
  .then((results) => {
    return results.rows;
  })
  .catch((err) => {
    console.log("error: ", err)
  })
};

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */
const getAllProperties = (options, limit = 10) => {

  return pool
    .query(
      `SELECT * FROM properties LIMIT $1`,
      [limit])
    .then((result) => {
      console.log(result.rows);
      return result.rows;
    })
    .catch((err) => {
      console.log(err.message);
    });
};


/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function (property) {
  const propertyId = Object.keys(properties).length + 1;
  property.id = propertyId;
  properties[propertyId] = property;
  return Promise.resolve(property);
};

module.exports = {
  getUserWithEmail,
  getUserWithId,
  addUser,
  getAllReservations,
  getAllProperties,
  addProperty,
};
