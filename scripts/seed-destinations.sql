-- Insert sample destinations for travel suggestions
INSERT INTO destinations (name, country, city, description, average_cost_per_day, best_time_to_visit, popular_activities, latitude, longitude, image_url) VALUES
('Paris', 'France', 'Paris', 'The City of Light, famous for its art, fashion, gastronomy, and culture.', 150.00, 'April to June, September to October', ARRAY['Visit Eiffel Tower', 'Louvre Museum', 'Seine River Cruise', 'Montmartre District'], 48.8566, 2.3522, '/placeholder.svg?height=300&width=400'),

('Tokyo', 'Japan', 'Tokyo', 'A bustling metropolis blending traditional culture with cutting-edge technology.', 120.00, 'March to May, September to November', ARRAY['Visit Senso-ji Temple', 'Shibuya Crossing', 'Tokyo Skytree', 'Traditional Sushi'], 35.6762, 139.6503, '/placeholder.svg?height=300&width=400'),

('New York City', 'United States', 'New York', 'The Big Apple, known for its iconic skyline, Broadway shows, and diverse culture.', 200.00, 'April to June, September to November', ARRAY['Statue of Liberty', 'Central Park', 'Broadway Shows', 'Times Square'], 40.7128, -74.0060, '/placeholder.svg?height=300&width=400'),

('London', 'United Kingdom', 'London', 'A historic city with royal palaces, world-class museums, and vibrant neighborhoods.', 180.00, 'May to September', ARRAY['Big Ben', 'British Museum', 'Tower of London', 'Thames River'], 51.5074, -0.1278, '/placeholder.svg?height=300&width=400'),

('Rome', 'Italy', 'Rome', 'The Eternal City, home to ancient ruins, Vatican City, and incredible cuisine.', 100.00, 'April to June, September to October', ARRAY['Colosseum', 'Vatican Museums', 'Trevi Fountain', 'Roman Forum'], 41.9028, 12.4964, '/placeholder.svg?height=300&width=400'),

('Barcelona', 'Spain', 'Barcelona', 'A vibrant city known for Gaudí architecture, beaches, and lively culture.', 90.00, 'May to September', ARRAY['Sagrada Familia', 'Park Güell', 'Las Ramblas', 'Beach Time'], 41.3851, 2.1734, '/placeholder.svg?height=300&width=400'),

('Bangkok', 'Thailand', 'Bangkok', 'A bustling capital with ornate temples, vibrant street life, and amazing food.', 50.00, 'November to March', ARRAY['Grand Palace', 'Wat Pho Temple', 'Floating Markets', 'Street Food Tours'], 13.7563, 100.5018, '/placeholder.svg?height=300&width=400'),

('Sydney', 'Australia', 'Sydney', 'Harbor city famous for its Opera House, beaches, and laid-back lifestyle.', 140.00, 'September to November, March to May', ARRAY['Sydney Opera House', 'Harbour Bridge', 'Bondi Beach', 'Blue Mountains'], -33.8688, 151.2093, '/placeholder.svg?height=300&width=400'),

('Dubai', 'United Arab Emirates', 'Dubai', 'A modern city with luxury shopping, ultramodern architecture, and desert adventures.', 160.00, 'November to March', ARRAY['Burj Khalifa', 'Desert Safari', 'Dubai Mall', 'Palm Jumeirah'], 25.2048, 55.2708, '/placeholder.svg?height=300&width=400'),

('Bali', 'Indonesia', 'Denpasar', 'Tropical paradise known for beaches, temples, and rich cultural heritage.', 60.00, 'April to October', ARRAY['Uluwatu Temple', 'Rice Terraces', 'Beach Hopping', 'Traditional Spa'], -8.3405, 115.0920, '/placeholder.svg?height=300&width=400');
