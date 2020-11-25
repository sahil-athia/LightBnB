INSERT INTO users (name, email, password)
VALUES ('steve', 'bigS@yahoo.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
('al', 'alal@hotmail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
('hugo', 'hugo123@gmail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.');

INSERT INTO properties (owner_id, title, description, thumbnail_photo_url, cover_photo_url, cost_per_night, parking_spaces, number_of_bathrooms, number_of_bedrooms, country, street, city, province, post_code, active)
VALUES (1, 'nice place', 'description', 'https://static.dezeen.com/uploads/2020/02/house-in-the-landscape-niko-arcjitect-architecture-residential-russia-houses-khurtin_dezeen_2364_hero.jpg', 'https://static.dezeen.com/uploads/2020/02/house-in-the-landscape-niko-arcjitect-architecture-residential-russia-houses-khurtin_dezeen_2364_hero.jpg', '120000', 10, 9, 8, 'Canada', '123 nice road', 'Toronto', 'Ontario', 'XYZ123', true),
(2, 'ok place', 'description', 'https://im-media.voltron.voanews.com/Drupal/01live-166/styles/sourced/s3/2019-11/IMG_5577.JPG?itok=Vl0aR9EE', 'https://im-media.voltron.voanews.com/Drupal/01live-166/styles/sourced/s3/2019-11/IMG_5577.JPG?itok=Vl0aR9EE', '12000', 5, 4, 3, 'Canada', '456 ok road', 'Vancouver', 'BC', 'ABC789', true),
(3, 'penthouse', 'description', 'https://static1.mansionglobal.com/production/media/article-images/ae144247dcc8032e1eda5bf42e3e03f9/large_Sky-Terrace_4K.jpg', 'https://static1.mansionglobal.com/production/media/article-images/ae144247dcc8032e1eda5bf42e3e03f9/large_Sky-Terrace_4K.jpg', '640000', 5, 5, 5, 'Canada', 'fancy street', 'Toronto', 'Ontario', 'AAA111', true);

INSERT INTO reservations (start_date, end_date, property_id, guest_id)
VALUES ('2020-03-13', '2020-03-17', 2, 2),
('2020-04-10', '2020-04-17', 1, 3),
('2020-04-27', '2020-05-03', 3, 2);

INSERT INTO property_reviews (guest_id, property_id, reservation_id, rating, message)
VALUES (2, 2, 1, 4, 'message'),
(3, 1, 2, 5, 'message'), 
(2, 3, 3, 5, 'message');