-- Insert sample organizations
INSERT INTO organizations (name, type, contact_email, contact_phone, address, verification_status) VALUES
('Child Rescue Foundation', 'ngo', 'contact@childrescue.org', '+1-555-0101', '123 Hope Street, City, State', 'verified'),
('Metropolitan Police Department', 'police', 'missing@metro-pd.gov', '+1-555-0102', '456 Justice Ave, City, State', 'verified'),
('Safe Haven NGO', 'ngo', 'info@safehaven.org', '+1-555-0103', '789 Care Blvd, City, State', 'verified');

-- Insert sample users
INSERT INTO platform_users (email, name, role, organization_id, phone, is_verified) VALUES
('admin@childrescue.org', 'Sarah Johnson', 'ngo_admin', 1, '+1-555-1001', true),
('officer.smith@metro-pd.gov', 'Officer John Smith', 'police', 2, '+1-555-1002', true),
('coordinator@safehaven.org', 'Maria Garcia', 'ngo_admin', 3, '+1-555-1003', true),
('volunteer@childrescue.org', 'David Chen', 'ngo_member', 1, '+1-555-1004', true);

-- Insert sample cases
INSERT INTO cases (child_name, age, gender, description, last_seen_location, last_seen_date, case_number, status, priority, organization_id, created_by, photo_urls, additional_info) VALUES
('Emma Thompson', 8, 'female', 'Brown hair, blue eyes, wearing a red jacket and blue jeans', 'Central Park, New York', '2024-01-15', 'CR-2024-001', 'active', 'high', 1, 1, ARRAY['/placeholder.svg?height=300&width=300'], '{"height": "4ft 2in", "distinguishing_marks": "Small scar on left knee"}'),
('Michael Rodriguez', 12, 'male', 'Black hair, brown eyes, wearing school uniform', 'Lincoln Elementary School', '2024-01-20', 'PD-2024-002', 'active', 'urgent', 2, 2, ARRAY['/placeholder.svg?height=300&width=300'], '{"height": "5ft 1in", "last_seen_with": "Blue backpack"}'),
('Lily Chen', 6, 'female', 'Long black hair, wearing pink dress', 'Shopping Mall Downtown', '2024-01-25', 'SH-2024-003', 'active', 'high', 3, 3, ARRAY['/placeholder.svg?height=300&width=300'], '{"height": "3ft 8in", "speaks": "English and Mandarin"}');

-- Insert sample sightings
INSERT INTO sightings (case_id, reporter_name, reporter_email, reporter_phone, sighting_location, sighting_date, sighting_time, description, confidence_level, status) VALUES
(1, 'Anonymous Caller', 'anonymous@example.com', '+1-555-2001', 'Times Square Area', '2024-01-16', '14:30:00', 'Saw a girl matching the description near the subway entrance', 3, 'pending'),
(2, 'Store Manager', 'manager@store.com', '+1-555-2002', 'Downtown Shopping Center', '2024-01-21', '16:45:00', 'Child was seen in the food court area', 4, 'verified'),
(1, 'Concerned Citizen', 'citizen@email.com', '+1-555-2003', 'Brooklyn Bridge Park', '2024-01-17', '11:20:00', 'Girl playing alone, seemed lost', 2, 'false_positive');
