INSERT INTO users (name, email, password)
VALUES ('Brett', 'brettg@gmail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u'),
('Salmon', 'SalmonS@gmail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u'),
('Xavier', 'Xavierx@gmail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u');

INSERT INTO properties (owner_id, title, description, thumbnail_photo_url, cover_photo_url, 
cost_per_night, parking_spaces, number_of_bathrooms, number_of_bedrooms, country, street, city, 
province, post_code, active)
VALUES (1, 'Pizza Palace', 'description', 'https://images.pexels.com/photos/2086676/pexels-photo-2086676.jpeg?auto=compress&cs=tinysrgb&h=350',
 'https://images.pexels.com/photos/2086676/pexels-photo-2086676.jpeg', 93061, 6, 4,  8, 'Canada', '536 Namsub Highway', 'Sotboske',
 'Quebec', '28142', true),
 (2, 'Salmons Sanctuary', 'description', 'https://images.pexels.com/photos/2086676/pexels-photo-2086676.jpeg?auto=compress&cs=tinysrgb&h=350',
 'https://images.pexels.com/photos/2086676/pexels-photo-2086676.jpeg', 1, 2, 3,  4, 'Canada', '217 heemingway', 'elbow',
 'Saskatchewan', '21212', true),
 (3, 'XXXAvier', 'description', 'https://images.pexels.com/photos/2086676/pexels-photo-2086676.jpeg?auto=compress&cs=tinysrgb&h=350',
 'https://images.pexels.com/photos/2086676/pexels-photo-2086676.jpeg', 10000, 4, 3,  2, 'Canada', '536 Namsub Highway', 'Sotboske',
 'Quebec', '28142', true);

INSERT INTO reservations (start_date, end_date, property_id, guest_id)
VALUES ('2018-09-11', '2018-09-26', 1, 1),
('2019-01-04', '2019-02-01', 2, 2),
('2021-10-01', '2021-10-14', 3, 3);

INSERT INTO property_reviews (guest_id, property_id, reservation_id, rating, message)
VALUES (3, 2, 1, 3, 'messages'),
(2, 2, 2, 4, 'messages'),
(3, 1, 3, 4, 'messages');