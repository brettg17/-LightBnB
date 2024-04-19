const { Pool } = require("pg");

const pool = new Pool({
  user: "labber",
  password: "labber",
  host: "localhost",
  database: "lightbnb"
});

//fetch properties
pool.query(`SELECT title FROM properties LIMIT 10;`)
  .then(response => {
    console.log(response);
  })
  .catch(error => {
    console.error(error);
  });

//import JSON data
const properties = require("./json/properties.json");
const users = require("./json/users.json");


/// Users

//get user by email
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

//get user by id
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

// add a new user
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

// get all users for a user 
const getAllReservations = function (guest_id, limit = 10) {

  const queryStr = 
  `SELECT reservations.id, properties.title, properties.cost_per_night, reservations.start_date, avg(rating) as average_rating
  FROM reservations
  JOIN properties ON reservations.property_id = properties.id
  JOIN property_reviews ON properties.id = property_reviews.property_id
  WHERE reservations.guest_id = $1
  GROUP BY properties.id, reservations.id
  ORDER BY reservations.start_date;
  LIMIT $2
  `
  const queryParams = [guest_id, limit]

  return pool.query(queryStr, queryParams)
  .then((results) => {
    return results.rows;
  })
  .catch((err) => {
    console.log("error: ", err)
  })
};

/// Properties

//get all properties
const getAllProperties = function (options, limit = 10) {
  const queryParams = [];
  let queryString = `
    SELECT properties.*, avg(property_reviews.rating) as average_rating
    FROM properties
    JOIN property_reviews ON properties.id = property_reviews.property_id
    WHERE 1=1
  `;

  // Check if city is provided
  if (options.city) {
    queryParams.push(`%${options.city}%`);
    queryString += ` AND city LIKE $${queryParams.length}`;
  }

  // Add logic to only include AND if it's not the first condition
  if (options.owner_id) {
    const prefix = queryParams.length > 0 ? ' AND' : ' WHERE';
    queryParams.push(options.owner_id);
    queryString += `${prefix} owner_id = $${queryParams.length}`;
  }

  // Adjustments for price range and minimum rating
  if (options.minimum_price_per_night && options.maximum_price_per_night) {
    queryParams.push(options.minimum_price_per_night * 100);
    queryString += `${queryParams.length > 0 ? ' AND' : ' WHERE'} cost_per_night >= $${queryParams.length}`;
    
    queryParams.push(options.maximum_price_per_night * 100);
    queryString += ` AND cost_per_night <= $${queryParams.length}`;
  }

  queryString += ` GROUP BY properties.id`;

  if (options.minimum_rating) {
    queryParams.push(options.minimum_rating);
    queryString += ` HAVING AVG(property_reviews.rating) >= $${queryParams.length}`;
  }

  queryParams.push(limit);
  queryString += `
    ORDER BY cost_per_night
    LIMIT $${queryParams.length};
  `;

  console.log(queryString, queryParams);

  return pool.query(queryString, queryParams).then((res) => res.rows);
};



//insert a new property into database
const addProperty = function (property) {
  const queryStr = `
  INSERT INTO properties (owner_id, title, description, thumbnail_photo_url, cover_photo_url, 
    cost_per_night, street, city, province, post_code, country, parking_spaces, 
    number_of_bathrooms, number_of_bedrooms)
  VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
  RETURNING *;
  `
  const queryParams = [
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
    property.number_of_bedrooms,
  ];
  
  return pool.query(queryStr, queryParams)
  .then((results) => {
    return results.rows[0]
  })
  .catch((err) => {
    console.log("error: ", err)
  });
};

module.exports = {
  getUserWithEmail,
  getUserWithId,
  addUser,
  getAllReservations,
  getAllProperties,
  addProperty,
};
