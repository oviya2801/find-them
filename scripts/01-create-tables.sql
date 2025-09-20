-- Create organizations table
CREATE TABLE IF NOT EXISTS organizations (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL CHECK (type IN ('ngo', 'police', 'government')),
  contact_email VARCHAR(255) NOT NULL UNIQUE,
  contact_phone VARCHAR(20),
  address TEXT,
  verification_status VARCHAR(20) DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create users table (extending the existing one)
CREATE TABLE IF NOT EXISTS platform_users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(20) DEFAULT 'public' CHECK (role IN ('public', 'ngo_admin', 'ngo_member', 'police', 'admin')),
  organization_id INTEGER REFERENCES organizations(id),
  phone VARCHAR(20),
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create cases table
CREATE TABLE IF NOT EXISTS cases (
  id SERIAL PRIMARY KEY,
  child_name VARCHAR(255) NOT NULL,
  age INTEGER,
  gender VARCHAR(10) CHECK (gender IN ('male', 'female', 'other')),
  description TEXT,
  last_seen_location TEXT,
  last_seen_date DATE,
  case_number VARCHAR(100) UNIQUE,
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'found', 'closed')),
  priority VARCHAR(10) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  organization_id INTEGER NOT NULL REFERENCES organizations(id),
  created_by INTEGER NOT NULL REFERENCES platform_users(id),
  photo_urls TEXT[], -- Array of photo URLs
  additional_info JSONB, -- Flexible field for extra information
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create sightings table
CREATE TABLE IF NOT EXISTS sightings (
  id SERIAL PRIMARY KEY,
  case_id INTEGER NOT NULL REFERENCES cases(id),
  reporter_name VARCHAR(255),
  reporter_email VARCHAR(255),
  reporter_phone VARCHAR(20),
  sighting_location TEXT NOT NULL,
  sighting_date DATE NOT NULL,
  sighting_time TIME,
  description TEXT,
  photo_urls TEXT[], -- Array of photo URLs
  confidence_level INTEGER CHECK (confidence_level BETWEEN 1 AND 5),
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'verified', 'false_positive')),
  verified_by INTEGER REFERENCES platform_users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create photo_embeddings table for AI matching
CREATE TABLE IF NOT EXISTS photo_embeddings (
  id SERIAL PRIMARY KEY,
  case_id INTEGER NOT NULL REFERENCES cases(id),
  photo_url TEXT NOT NULL,
  embedding VECTOR(512), -- Assuming 512-dimensional embeddings
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_cases_status ON cases(status);
CREATE INDEX IF NOT EXISTS idx_cases_organization ON cases(organization_id);
CREATE INDEX IF NOT EXISTS idx_sightings_case ON sightings(case_id);
CREATE INDEX IF NOT EXISTS idx_sightings_status ON sightings(status);
CREATE INDEX IF NOT EXISTS idx_organizations_type ON organizations(type);
CREATE INDEX IF NOT EXISTS idx_users_role ON platform_users(role);
