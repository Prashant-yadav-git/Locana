-- Insert sample shops with images
INSERT INTO public.shops (id, name, description, address, latitude, longitude, phone, email, category, owner_id, image_url) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Raj Medical & General Store', 'Complete medical and general items store', '123 Main Street, Delhi', 28.6139, 77.2090, '+91-9876543210', 'raj@medical.com', 'Medical', NULL, '/pharmacy-storefront.png'),
('550e8400-e29b-41d4-a716-446655440002', 'Fresh Fruits Corner', 'Fresh fruits and vegetables daily', '456 Market Road, Mumbai', 19.0760, 72.8777, '+91-9876543211', 'fresh@fruits.com', 'Grocery', NULL, '/grocery-store-front.jpg'),
('550e8400-e29b-41d4-a716-446655440003', 'Tech Electronics Hub', 'Latest electronics and gadgets', '789 Tech Street, Bangalore', 12.9716, 77.5946, '+91-9876543212', 'tech@electronics.com', 'Electronics', NULL, '/electronics-store-interior.png'),
('550e8400-e29b-41d4-a716-446655440004', 'City Bakery', 'Fresh baked goods daily', '789 Baker Street, Delhi', 28.6159, 77.2110, '+91-9876543213', 'city@bakery.com', 'Bakery', NULL, '/bakery-storefront.png'),
('550e8400-e29b-41d4-a716-446655440005', 'HealthPlus Pharmacy', 'Your health partner', '555 Health Road, Delhi', 28.6129, 77.2080, '+91-9876543214', 'health@plus.com', 'Medical', NULL, '/pharmacy-storefront.png');

-- Insert sample products with images
INSERT INTO public.products (shop_id, name, description, price, category, stock_quantity, image_url) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Paracetamol 500mg', 'Pain relief tablets', 25.00, 'Medicine', 100, '/paracetamol-tablets.png'),
('550e8400-e29b-41d4-a716-446655440001', 'Hand Sanitizer', 'Alcohol-based sanitizer 500ml', 120.00, 'Healthcare', 50, '/hand-sanitizer-bottle.jpg'),
('550e8400-e29b-41d4-a716-446655440001', 'Dolo 650', 'Fever and pain relief', 28.00, 'Medicine', 80, '/medicine-tablet.png'),
('550e8400-e29b-41d4-a716-446655440001', 'Crocin Tablets', 'Pain relief medicine', 25.00, 'Medicine', 90, '/crocin-tablets.jpg'),
('550e8400-e29b-41d4-a716-446655440001', 'Face Masks', 'Surgical face masks pack', 50.00, 'Healthcare', 60, '/medical-face-masks.jpg'),
('550e8400-e29b-41d4-a716-446655440001', 'Vicks VapoRub', 'Cold relief ointment', 85.00, 'Medicine', 45, '/vicks-vaporub-bottle.jpg'),
('550e8400-e29b-41d4-a716-446655440002', 'Aashirvaad Atta 5kg', 'Premium wheat flour', 259.00, 'Grocery', 30, '/flour-bag.png'),
('550e8400-e29b-41d4-a716-446655440002', 'Mother Dairy Milk 1L', 'Fresh full cream milk', 56.00, 'Dairy', 100, '/milk-packet.jpg'),
('550e8400-e29b-41d4-a716-446655440002', 'Maggi 2-min Noodles', 'Instant noodles', 12.00, 'Grocery', 150, '/noodles-packet.jpg');
