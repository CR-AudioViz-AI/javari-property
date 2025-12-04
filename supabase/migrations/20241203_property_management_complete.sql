-- ============================================================================
-- CR REALTOR PLATFORM - COMPLETE PROPERTY MANAGEMENT SYSTEM
-- ============================================================================
-- Created: December 3, 2025
-- Description: Enterprise-grade property management with AI features
-- Supports: Residential, Commercial, Industrial properties
-- Access: Standalone OR Realtor Addon
-- ============================================================================

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- For fuzzy text search

-- ============================================================================
-- ENUMS - Property Classifications
-- ============================================================================

CREATE TYPE pm_property_category AS ENUM ('residential', 'commercial', 'industrial');

CREATE TYPE pm_residential_type AS ENUM (
  'single_family', 'apartment', 'condo', 'townhouse', 'duplex', 
  'triplex', 'fourplex', 'mobile_home', 'student_housing', 'senior_living'
);

CREATE TYPE pm_commercial_type AS ENUM (
  'office', 'retail', 'restaurant', 'medical', 'mixed_use', 
  'hotel_motel', 'strip_mall', 'shopping_center'
);

CREATE TYPE pm_industrial_type AS ENUM (
  'warehouse', 'manufacturing', 'distribution', 'flex_space', 
  'cold_storage', 'data_center', 'research_facility'
);

-- ============================================================================
-- ENUMS - Status Types
-- ============================================================================

CREATE TYPE lease_status AS ENUM (
  'draft', 'pending_signature', 'active', 'expiring_soon', 
  'expired', 'terminated', 'renewed', 'month_to_month'
);

CREATE TYPE tenant_status AS ENUM (
  'prospect', 'applicant', 'screening', 'approved', 'active', 
  'notice_given', 'moved_out', 'evicted', 'rejected'
);

CREATE TYPE maintenance_priority AS ENUM ('emergency', 'urgent', 'high', 'medium', 'low');

CREATE TYPE maintenance_status AS ENUM (
  'submitted', 'acknowledged', 'scheduled', 'in_progress', 
  'pending_parts', 'completed', 'cancelled', 'on_hold'
);

CREATE TYPE payment_status AS ENUM (
  'pending', 'processing', 'paid', 'partial', 'late', 
  'failed', 'refunded', 'waived', 'nsf'
);

CREATE TYPE maintenance_category AS ENUM (
  'plumbing', 'electrical', 'hvac', 'appliance', 'structural', 
  'pest', 'landscaping', 'cleaning', 'locksmith', 'roofing', 
  'flooring', 'painting', 'windows', 'doors', 'other'
);

CREATE TYPE application_status AS ENUM (
  'pending', 'reviewing', 'screening', 'approved', 'denied', 
  'cancelled', 'waitlisted'
);

CREATE TYPE inspection_type AS ENUM (
  'move_in', 'move_out', 'routine', 'annual', 'complaint', 
  'pre_listing', 'periodic'
);

-- ============================================================================
-- PROPERTY MANAGEMENT SUBSCRIPTIONS & BILLING
-- ============================================================================

CREATE TABLE pm_subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Plan Details
  plan_type TEXT NOT NULL DEFAULT 'starter', -- starter, professional, business, enterprise
  billing_cycle TEXT DEFAULT 'monthly', -- monthly, annual
  
  -- Units
  unit_count INTEGER DEFAULT 0,
  max_units INTEGER DEFAULT 25, -- Based on plan
  
  -- Features
  features JSONB DEFAULT '{}'::jsonb,
  ai_features_enabled BOOLEAN DEFAULT false,
  
  -- Billing
  stripe_subscription_id TEXT,
  stripe_customer_id TEXT,
  monthly_price NUMERIC(10, 2),
  
  -- Status
  status TEXT DEFAULT 'active', -- active, past_due, cancelled, trialing
  trial_ends_at TIMESTAMPTZ,
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  
  -- Realtor Addon
  is_realtor_addon BOOLEAN DEFAULT false,
  realtor_subscription_id UUID,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- PROPERTY MANAGERS
-- ============================================================================

CREATE TABLE property_managers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  subscription_id UUID REFERENCES pm_subscriptions(id),
  
  -- Profile
  company_name TEXT,
  first_name TEXT,
  last_name TEXT,
  email TEXT,
  phone TEXT,
  
  -- Business Info
  license_number TEXT,
  license_state TEXT,
  license_expiry DATE,
  insurance_policy_number TEXT,
  insurance_expiry DATE,
  
  -- Commission & Fees
  default_commission_rate NUMERIC(5, 2) DEFAULT 10.00,
  management_fee_type TEXT DEFAULT 'percentage',
  management_fee NUMERIC(10, 2),
  
  -- Settings
  is_realtor BOOLEAN DEFAULT false,
  realtor_profile_id UUID,
  specialties pm_property_category[] DEFAULT '{residential}',
  service_areas TEXT[],
  timezone TEXT DEFAULT 'America/New_York',
  
  -- Stats (auto-calculated)
  properties_managed INTEGER DEFAULT 0,
  units_managed INTEGER DEFAULT 0,
  active_tenants INTEGER DEFAULT 0,
  
  -- Branding
  logo_url TEXT,
  brand_color TEXT DEFAULT '#2563eb',
  
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- LANDLORDS / PROPERTY OWNERS
-- ============================================================================

CREATE TABLE landlords (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  property_manager_id UUID REFERENCES property_managers(id) ON DELETE CASCADE,
  
  -- Profile
  company_name TEXT,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  zip TEXT,
  
  -- Tax Info (encrypted in production)
  tax_id TEXT,
  tax_classification TEXT, -- individual, llc, corporation, partnership
  
  -- Payment Settings
  payment_method TEXT DEFAULT 'ach', -- ach, check, hold
  bank_name TEXT,
  bank_account_last4 TEXT,
  routing_number_last4 TEXT,
  payment_schedule TEXT DEFAULT 'monthly', -- weekly, biweekly, monthly
  payment_day INTEGER DEFAULT 15, -- Day of month for disbursement
  min_disbursement NUMERIC(10, 2) DEFAULT 100.00,
  
  -- Management Agreement
  management_agreement_signed BOOLEAN DEFAULT false,
  agreement_signed_date DATE,
  agreement_document_url TEXT,
  commission_rate NUMERIC(5, 2), -- Override PM default if negotiated
  
  -- Communication
  preferred_contact TEXT DEFAULT 'email',
  portal_access_enabled BOOLEAN DEFAULT true,
  notification_preferences JSONB DEFAULT '{"email": true, "sms": false}'::jsonb,
  
  notes TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- RENTAL PROPERTIES
-- ============================================================================

CREATE TABLE rental_properties (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_manager_id UUID REFERENCES property_managers(id) ON DELETE CASCADE,
  landlord_id UUID REFERENCES landlords(id) ON DELETE SET NULL,
  
  -- Identification
  property_code TEXT, -- PM's internal code
  name TEXT, -- "Sunset Apartments", "123 Main Street"
  
  -- Location
  address TEXT NOT NULL,
  address_line2 TEXT,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  zip TEXT NOT NULL,
  county TEXT,
  country TEXT DEFAULT 'US',
  latitude NUMERIC(10, 7),
  longitude NUMERIC(10, 7),
  
  -- Classification
  category pm_property_category NOT NULL,
  residential_type pm_residential_type,
  commercial_type pm_commercial_type,
  industrial_type pm_industrial_type,
  
  -- Building Details
  year_built INTEGER,
  total_units INTEGER DEFAULT 1,
  total_sqft INTEGER,
  lot_size NUMERIC(10, 2),
  lot_size_unit TEXT DEFAULT 'sqft', -- sqft, acres
  stories INTEGER DEFAULT 1,
  parking_spaces INTEGER DEFAULT 0,
  parking_type TEXT, -- garage, carport, lot, street
  
  -- Financials
  purchase_price NUMERIC(12, 2),
  purchase_date DATE,
  current_value NUMERIC(12, 2),
  last_appraisal_date DATE,
  mortgage_payment NUMERIC(10, 2),
  mortgage_lender TEXT,
  property_tax_annual NUMERIC(10, 2),
  insurance_annual NUMERIC(10, 2),
  insurance_policy TEXT,
  insurance_expiry DATE,
  hoa_monthly NUMERIC(10, 2),
  hoa_name TEXT,
  
  -- Utilities
  utilities_included TEXT[], -- water, electric, gas, trash, internet, cable
  utility_providers JSONB DEFAULT '{}'::jsonb,
  
  -- Amenities
  amenities TEXT[],
  
  -- Status
  is_active BOOLEAN DEFAULT true,
  listing_status TEXT DEFAULT 'not_listed', -- not_listed, listed, leased
  
  -- Media
  images JSONB DEFAULT '[]'::jsonb,
  documents JSONB DEFAULT '[]'::jsonb,
  virtual_tour_url TEXT,
  
  -- SEO/Marketing
  description TEXT,
  marketing_description TEXT,
  
  -- Notes
  notes TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- RENTAL UNITS
-- ============================================================================

CREATE TABLE rental_units (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID REFERENCES rental_properties(id) ON DELETE CASCADE,
  
  -- Identification
  unit_number TEXT NOT NULL,
  unit_name TEXT, -- "The Penthouse", "Garden Suite"
  unit_code TEXT, -- PM internal code
  
  -- Details
  floor INTEGER,
  bedrooms INTEGER DEFAULT 1,
  bathrooms NUMERIC(3, 1) DEFAULT 1,
  half_baths INTEGER DEFAULT 0,
  sqft INTEGER,
  
  -- Rent
  market_rent NUMERIC(10, 2),
  current_rent NUMERIC(10, 2),
  rent_frequency TEXT DEFAULT 'monthly',
  security_deposit NUMERIC(10, 2),
  last_rent_increase DATE,
  
  -- Status
  is_available BOOLEAN DEFAULT true,
  available_date DATE,
  listing_status TEXT DEFAULT 'not_listed',
  
  -- Current Occupancy
  current_lease_id UUID,
  current_tenant_id UUID,
  
  -- Features
  amenities TEXT[],
  appliances TEXT[],
  flooring_type TEXT,
  has_washer_dryer BOOLEAN DEFAULT false,
  has_dishwasher BOOLEAN DEFAULT false,
  has_ac BOOLEAN DEFAULT true,
  has_heating BOOLEAN DEFAULT true,
  heating_type TEXT,
  cooling_type TEXT,
  
  -- Utilities
  utilities_included TEXT[],
  
  -- Pets
  pet_policy TEXT DEFAULT 'no_pets',
  pet_deposit NUMERIC(10, 2),
  pet_rent_monthly NUMERIC(10, 2),
  pet_restrictions TEXT,
  
  -- Parking
  parking_spaces INTEGER DEFAULT 0,
  parking_type TEXT,
  parking_fee NUMERIC(10, 2),
  
  -- Storage
  storage_included BOOLEAN DEFAULT false,
  storage_fee NUMERIC(10, 2),
  
  -- Media
  images JSONB DEFAULT '[]'::jsonb,
  floor_plan_url TEXT,
  virtual_tour_url TEXT,
  
  -- Marketing
  description TEXT,
  
  -- Renovation/Maintenance
  last_renovation DATE,
  next_inspection_date DATE,
  
  notes TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(property_id, unit_number)
);

-- ============================================================================
-- TENANTS
-- ============================================================================

CREATE TABLE tenants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  property_manager_id UUID REFERENCES property_managers(id) ON DELETE CASCADE,
  
  -- Personal Info
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  alternate_phone TEXT,
  date_of_birth DATE,
  ssn_last4 TEXT,
  
  -- Identification
  id_type TEXT, -- drivers_license, passport, state_id
  id_number TEXT,
  id_state TEXT,
  id_expiry DATE,
  
  -- Employment
  employer TEXT,
  employer_phone TEXT,
  job_title TEXT,
  monthly_income NUMERIC(10, 2),
  employment_start_date DATE,
  employment_type TEXT, -- full_time, part_time, self_employed, retired, student
  
  -- Additional Income
  additional_income NUMERIC(10, 2),
  additional_income_source TEXT,
  
  -- Emergency Contact
  emergency_contact_name TEXT,
  emergency_contact_phone TEXT,
  emergency_contact_relationship TEXT,
  
  -- Rental History
  previous_address TEXT,
  previous_city TEXT,
  previous_state TEXT,
  previous_zip TEXT,
  previous_landlord_name TEXT,
  previous_landlord_phone TEXT,
  years_at_previous NUMERIC(3, 1),
  reason_for_leaving TEXT,
  
  -- Vehicles
  vehicles JSONB DEFAULT '[]'::jsonb,
  
  -- Pets
  pets JSONB DEFAULT '[]'::jsonb,
  
  -- Screening
  status tenant_status DEFAULT 'prospect',
  credit_score INTEGER,
  credit_report_date DATE,
  background_check_date DATE,
  background_check_status TEXT,
  eviction_history BOOLEAN,
  criminal_history BOOLEAN,
  income_verified BOOLEAN DEFAULT false,
  
  -- AI Score (our competitive advantage)
  ai_tenant_score INTEGER, -- 0-100 AI-calculated risk score
  ai_score_factors JSONB DEFAULT '{}'::jsonb,
  ai_score_date TIMESTAMPTZ,
  
  -- Portal Access
  portal_access_enabled BOOLEAN DEFAULT false,
  portal_invite_sent BOOLEAN DEFAULT false,
  portal_invite_date TIMESTAMPTZ,
  last_portal_login TIMESTAMPTZ,
  
  -- Documents
  documents JSONB DEFAULT '[]'::jsonb,
  photo_url TEXT,
  
  -- Communication Preferences
  notification_preferences JSONB DEFAULT '{"email": true, "sms": true}'::jsonb,
  
  -- Tags for organization
  tags TEXT[],
  
  notes TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Co-tenants / Occupants
CREATE TABLE co_tenants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  primary_tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  date_of_birth DATE,
  relationship TEXT, -- spouse, partner, roommate, child, parent, other
  is_on_lease BOOLEAN DEFAULT true,
  is_adult BOOLEAN DEFAULT true,
  
  -- Screening (if on lease)
  credit_score INTEGER,
  background_check_date DATE,
  background_check_status TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- RENTAL APPLICATIONS
-- ============================================================================

CREATE TABLE rental_applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_manager_id UUID REFERENCES property_managers(id) ON DELETE CASCADE,
  unit_id UUID REFERENCES rental_units(id) ON DELETE SET NULL,
  tenant_id UUID REFERENCES tenants(id),
  
  -- Application Details
  application_date TIMESTAMPTZ DEFAULT NOW(),
  desired_move_in DATE,
  lease_term_months INTEGER DEFAULT 12,
  
  -- Status
  status application_status DEFAULT 'pending',
  status_changed_at TIMESTAMPTZ,
  status_changed_by UUID REFERENCES auth.users(id),
  
  -- Screening Results
  credit_report JSONB,
  background_report JSONB,
  eviction_report JSONB,
  income_verification JSONB,
  
  -- AI Scoring
  ai_score INTEGER,
  ai_recommendation TEXT, -- approve, review, deny
  ai_risk_factors JSONB,
  
  -- Decision
  decision TEXT, -- approved, denied, conditional
  decision_reason TEXT,
  decision_date TIMESTAMPTZ,
  decision_by UUID REFERENCES auth.users(id),
  
  -- Fees
  application_fee NUMERIC(10, 2),
  application_fee_paid BOOLEAN DEFAULT false,
  application_fee_date TIMESTAMPTZ,
  
  -- Documents
  documents JSONB DEFAULT '[]'::jsonb,
  
  notes TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- LEASES
-- ============================================================================

CREATE TABLE leases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_manager_id UUID REFERENCES property_managers(id) ON DELETE CASCADE,
  property_id UUID REFERENCES rental_properties(id),
  unit_id UUID REFERENCES rental_units(id) ON DELETE CASCADE,
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  
  -- Lease Terms
  lease_type TEXT DEFAULT 'fixed', -- fixed, month_to_month, week_to_week
  start_date DATE NOT NULL,
  end_date DATE,
  original_end_date DATE, -- Track if extended
  move_in_date DATE,
  move_out_date DATE,
  
  -- Rent
  monthly_rent NUMERIC(10, 2) NOT NULL,
  rent_frequency TEXT DEFAULT 'monthly',
  prorated_first_month NUMERIC(10, 2),
  
  -- Deposits
  security_deposit NUMERIC(10, 2),
  security_deposit_paid BOOLEAN DEFAULT false,
  security_deposit_held_by TEXT DEFAULT 'property_manager',
  pet_deposit NUMERIC(10, 2),
  last_month_rent NUMERIC(10, 2),
  other_deposits JSONB DEFAULT '[]'::jsonb,
  
  -- Payment Terms
  rent_due_day INTEGER DEFAULT 1,
  grace_period_days INTEGER DEFAULT 5,
  late_fee_type TEXT DEFAULT 'flat', -- flat, percentage, daily
  late_fee_amount NUMERIC(10, 2) DEFAULT 50,
  late_fee_percentage NUMERIC(5, 2),
  late_fee_daily NUMERIC(10, 2),
  late_fee_max NUMERIC(10, 2),
  nsf_fee NUMERIC(10, 2) DEFAULT 35,
  
  -- Recurring Charges
  pet_rent NUMERIC(10, 2),
  parking_fee NUMERIC(10, 2),
  storage_fee NUMERIC(10, 2),
  other_monthly_charges JSONB DEFAULT '[]'::jsonb,
  
  -- Status
  status lease_status DEFAULT 'draft',
  signed_date TIMESTAMPTZ,
  
  -- Renewal
  auto_renew BOOLEAN DEFAULT false,
  renewal_terms TEXT,
  renewal_rent_increase_type TEXT, -- flat, percentage
  renewal_rent_increase NUMERIC(10, 2),
  renewal_notice_days INTEGER DEFAULT 60,
  non_renewal_notice_days INTEGER DEFAULT 30,
  
  -- Termination
  termination_date DATE,
  termination_reason TEXT,
  termination_by TEXT, -- tenant, landlord, mutual
  termination_notes TEXT,
  move_out_inspection_date DATE,
  
  -- Documents
  lease_document_url TEXT,
  signed_lease_url TEXT,
  addendums JSONB DEFAULT '[]'::jsonb,
  
  -- Deposit Disposition
  deposit_disposition_date DATE,
  deposit_deductions JSONB DEFAULT '[]'::jsonb,
  deposit_refund_amount NUMERIC(10, 2),
  deposit_refund_date DATE,
  
  notes TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Lease renewal history
CREATE TABLE lease_renewals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  original_lease_id UUID REFERENCES leases(id) ON DELETE CASCADE,
  new_lease_id UUID REFERENCES leases(id),
  
  previous_rent NUMERIC(10, 2),
  new_rent NUMERIC(10, 2),
  rent_increase_amount NUMERIC(10, 2),
  rent_increase_percentage NUMERIC(5, 2),
  
  previous_end_date DATE,
  new_end_date DATE,
  
  renewal_offered_date DATE,
  tenant_response TEXT, -- accepted, declined, counter_offered
  tenant_response_date DATE,
  
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- RENT PAYMENTS
-- ============================================================================

CREATE TABLE rent_payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_manager_id UUID REFERENCES property_managers(id) ON DELETE CASCADE,
  lease_id UUID REFERENCES leases(id) ON DELETE CASCADE,
  tenant_id UUID REFERENCES tenants(id),
  property_id UUID REFERENCES rental_properties(id),
  unit_id UUID REFERENCES rental_units(id),
  
  -- Billing Period
  billing_period_start DATE,
  billing_period_end DATE,
  due_date DATE NOT NULL,
  
  -- Charges
  rent_amount NUMERIC(10, 2) NOT NULL,
  late_fee NUMERIC(10, 2) DEFAULT 0,
  pet_rent NUMERIC(10, 2) DEFAULT 0,
  parking_fee NUMERIC(10, 2) DEFAULT 0,
  storage_fee NUMERIC(10, 2) DEFAULT 0,
  utilities NUMERIC(10, 2) DEFAULT 0,
  other_charges NUMERIC(10, 2) DEFAULT 0,
  other_charges_description TEXT,
  credits NUMERIC(10, 2) DEFAULT 0,
  credits_description TEXT,
  total_amount NUMERIC(10, 2) NOT NULL,
  
  -- Payment
  amount_paid NUMERIC(10, 2) DEFAULT 0,
  balance_due NUMERIC(10, 2),
  payment_date DATE,
  
  -- Status
  status payment_status DEFAULT 'pending',
  days_late INTEGER DEFAULT 0,
  
  -- Payment Method
  payment_method TEXT, -- ach, credit_card, debit_card, check, cash, money_order, online
  payment_reference TEXT,
  payment_processor TEXT,
  transaction_id TEXT,
  
  -- Processing
  processed_date TIMESTAMPTZ,
  processed_by UUID REFERENCES auth.users(id),
  
  -- Auto-pay
  is_autopay BOOLEAN DEFAULT false,
  
  notes TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Payment ledger (immutable transaction log)
CREATE TABLE payment_ledger (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_manager_id UUID REFERENCES property_managers(id) ON DELETE CASCADE,
  payment_id UUID REFERENCES rent_payments(id),
  lease_id UUID REFERENCES leases(id),
  tenant_id UUID REFERENCES tenants(id),
  property_id UUID REFERENCES rental_properties(id),
  unit_id UUID REFERENCES rental_units(id),
  
  transaction_type TEXT NOT NULL, -- charge, payment, credit, refund, adjustment, late_fee, nsf
  transaction_date TIMESTAMPTZ DEFAULT NOW(),
  amount NUMERIC(10, 2) NOT NULL,
  running_balance NUMERIC(10, 2),
  
  description TEXT,
  reference TEXT,
  
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- MAINTENANCE REQUESTS
-- ============================================================================

CREATE TABLE maintenance_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_manager_id UUID REFERENCES property_managers(id) ON DELETE CASCADE,
  property_id UUID REFERENCES rental_properties(id) ON DELETE CASCADE,
  unit_id UUID REFERENCES rental_units(id),
  tenant_id UUID REFERENCES tenants(id),
  
  -- Request Number
  request_number TEXT, -- Auto-generated: MR-2024-0001
  
  -- Request Details
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category maintenance_category NOT NULL,
  priority maintenance_priority DEFAULT 'medium',
  status maintenance_status DEFAULT 'submitted',
  
  -- Location
  location_in_unit TEXT,
  
  -- Scheduling
  requested_date DATE,
  preferred_times JSONB, -- [{"day": "monday", "start": "09:00", "end": "12:00"}]
  scheduled_date DATE,
  scheduled_time_start TIME,
  scheduled_time_end TIME,
  completed_date DATE,
  
  -- Assignment
  assigned_to UUID REFERENCES auth.users(id),
  vendor_id UUID,
  
  -- Access
  permission_to_enter BOOLEAN DEFAULT false,
  entry_instructions TEXT,
  pet_in_unit BOOLEAN DEFAULT false,
  pet_instructions TEXT,
  
  -- Costs
  estimated_cost NUMERIC(10, 2),
  actual_cost NUMERIC(10, 2),
  labor_cost NUMERIC(10, 2),
  materials_cost NUMERIC(10, 2),
  tenant_responsible BOOLEAN DEFAULT false,
  tenant_charge_amount NUMERIC(10, 2),
  
  -- Resolution
  resolution_notes TEXT,
  root_cause TEXT,
  
  -- Feedback
  tenant_satisfaction INTEGER, -- 1-5 rating
  tenant_feedback TEXT,
  
  -- AI Features
  ai_diagnosis TEXT,
  ai_estimated_cost NUMERIC(10, 2),
  ai_suggested_vendor UUID,
  ai_priority_override maintenance_priority,
  
  -- Media
  images JSONB DEFAULT '[]'::jsonb,
  completion_images JSONB DEFAULT '[]'::jsonb,
  videos JSONB DEFAULT '[]'::jsonb,
  
  -- Communication
  tenant_notified BOOLEAN DEFAULT false,
  landlord_notified BOOLEAN DEFAULT false,
  
  notes TEXT,
  internal_notes TEXT, -- Not visible to tenant
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Maintenance work log
CREATE TABLE maintenance_work_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  request_id UUID REFERENCES maintenance_requests(id) ON DELETE CASCADE,
  
  action TEXT NOT NULL,
  performed_by UUID REFERENCES auth.users(id),
  vendor_id UUID,
  
  work_date DATE,
  start_time TIME,
  end_time TIME,
  labor_hours NUMERIC(5, 2),
  
  labor_cost NUMERIC(10, 2),
  materials_cost NUMERIC(10, 2),
  materials_description TEXT,
  
  notes TEXT,
  images JSONB DEFAULT '[]'::jsonb,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- VENDORS
-- ============================================================================

CREATE TABLE pm_vendors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_manager_id UUID REFERENCES property_managers(id) ON DELETE CASCADE,
  
  -- Company Info
  company_name TEXT NOT NULL,
  contact_name TEXT,
  email TEXT,
  phone TEXT,
  alternate_phone TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  zip TEXT,
  
  -- Services
  services maintenance_category[] NOT NULL,
  service_description TEXT,
  service_areas TEXT[],
  
  -- Business Info
  license_number TEXT,
  license_state TEXT,
  license_expiry DATE,
  insurance_policy TEXT,
  insurance_expiry DATE,
  w9_on_file BOOLEAN DEFAULT false,
  w9_date DATE,
  
  -- Rates
  hourly_rate NUMERIC(10, 2),
  emergency_rate NUMERIC(10, 2),
  minimum_charge NUMERIC(10, 2),
  payment_terms TEXT DEFAULT 'net_30',
  
  -- Performance
  jobs_completed INTEGER DEFAULT 0,
  total_billed NUMERIC(12, 2) DEFAULT 0,
  average_rating NUMERIC(3, 2),
  on_time_percentage NUMERIC(5, 2),
  
  -- Settings
  is_preferred BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  auto_assign_enabled BOOLEAN DEFAULT false,
  max_concurrent_jobs INTEGER,
  
  -- Availability
  availability JSONB, -- {"monday": {"start": "08:00", "end": "17:00"}, ...}
  emergency_available BOOLEAN DEFAULT false,
  
  notes TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- PROPERTY INSPECTIONS
-- ============================================================================

CREATE TABLE property_inspections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_manager_id UUID REFERENCES property_managers(id) ON DELETE CASCADE,
  property_id UUID REFERENCES rental_properties(id) ON DELETE CASCADE,
  unit_id UUID REFERENCES rental_units(id),
  lease_id UUID REFERENCES leases(id),
  tenant_id UUID REFERENCES tenants(id),
  
  -- Inspection Details
  inspection_type inspection_type NOT NULL,
  scheduled_date DATE,
  scheduled_time TIME,
  completed_date DATE,
  inspector_id UUID REFERENCES auth.users(id),
  
  -- Checklist
  checklist JSONB DEFAULT '{}'::jsonb,
  
  -- Condition Assessment
  overall_condition TEXT, -- excellent, good, fair, poor
  cleanliness_score INTEGER, -- 1-10
  
  -- Damages
  damages_found BOOLEAN DEFAULT false,
  damage_items JSONB DEFAULT '[]'::jsonb,
  damage_cost_estimate NUMERIC(10, 2),
  tenant_responsible_amount NUMERIC(10, 2),
  
  -- Meter Readings
  electric_meter_reading TEXT,
  gas_meter_reading TEXT,
  water_meter_reading TEXT,
  
  -- Keys
  keys_collected JSONB DEFAULT '[]'::jsonb,
  keys_returned JSONB DEFAULT '[]'::jsonb,
  
  -- Signatures
  inspector_signature TEXT,
  inspector_signed_date TIMESTAMPTZ,
  tenant_signature TEXT,
  tenant_signed_date TIMESTAMPTZ,
  tenant_present BOOLEAN DEFAULT false,
  
  -- Media
  photos JSONB DEFAULT '[]'::jsonb,
  videos JSONB DEFAULT '[]'::jsonb,
  
  -- Report
  report_url TEXT,
  
  notes TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- COMMUNICATIONS
-- ============================================================================

CREATE TABLE pm_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_manager_id UUID REFERENCES property_managers(id) ON DELETE CASCADE,
  
  -- Participants
  sender_type TEXT NOT NULL, -- pm, tenant, landlord, vendor
  sender_id UUID,
  recipient_type TEXT NOT NULL,
  recipient_id UUID,
  
  -- Thread
  thread_id UUID,
  parent_message_id UUID REFERENCES pm_messages(id),
  
  -- Content
  subject TEXT,
  message TEXT NOT NULL,
  attachments JSONB DEFAULT '[]'::jsonb,
  
  -- Context
  property_id UUID REFERENCES rental_properties(id),
  unit_id UUID REFERENCES rental_units(id),
  maintenance_request_id UUID REFERENCES maintenance_requests(id),
  lease_id UUID REFERENCES leases(id),
  
  -- Delivery
  channel TEXT DEFAULT 'portal', -- portal, email, sms
  email_sent BOOLEAN DEFAULT false,
  sms_sent BOOLEAN DEFAULT false,
  
  -- Status
  is_read BOOLEAN DEFAULT false,
  read_at TIMESTAMPTZ,
  is_archived BOOLEAN DEFAULT false,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- ACTIVITY LOG
-- ============================================================================

CREATE TABLE pm_activity_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_manager_id UUID REFERENCES property_managers(id) ON DELETE CASCADE,
  
  -- Who
  user_id UUID REFERENCES auth.users(id),
  user_type TEXT, -- pm, tenant, landlord, vendor, system
  
  -- What
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL, -- property, unit, tenant, lease, payment, maintenance
  entity_id UUID,
  
  -- Details
  description TEXT,
  old_values JSONB,
  new_values JSONB,
  metadata JSONB,
  
  -- Context
  ip_address INET,
  user_agent TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- OWNER STATEMENTS
-- ============================================================================

CREATE TABLE owner_statements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_manager_id UUID REFERENCES property_managers(id) ON DELETE CASCADE,
  landlord_id UUID REFERENCES landlords(id) ON DELETE CASCADE,
  
  -- Period
  statement_date DATE NOT NULL,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  
  -- Properties
  properties JSONB NOT NULL, -- Array of property IDs included
  
  -- Income
  rental_income NUMERIC(12, 2) DEFAULT 0,
  late_fees_collected NUMERIC(12, 2) DEFAULT 0,
  other_income NUMERIC(12, 2) DEFAULT 0,
  total_income NUMERIC(12, 2) DEFAULT 0,
  
  -- Expenses
  management_fee NUMERIC(12, 2) DEFAULT 0,
  maintenance_costs NUMERIC(12, 2) DEFAULT 0,
  repairs NUMERIC(12, 2) DEFAULT 0,
  utilities NUMERIC(12, 2) DEFAULT 0,
  insurance NUMERIC(12, 2) DEFAULT 0,
  property_tax NUMERIC(12, 2) DEFAULT 0,
  other_expenses NUMERIC(12, 2) DEFAULT 0,
  total_expenses NUMERIC(12, 2) DEFAULT 0,
  
  -- Net
  net_income NUMERIC(12, 2) DEFAULT 0,
  
  -- Disbursement
  owner_draw NUMERIC(12, 2) DEFAULT 0,
  disbursement_date DATE,
  disbursement_method TEXT,
  disbursement_reference TEXT,
  
  -- Reserve
  reserve_held NUMERIC(12, 2) DEFAULT 0,
  ending_balance NUMERIC(12, 2) DEFAULT 0,
  
  -- Document
  statement_url TEXT,
  
  -- Status
  is_finalized BOOLEAN DEFAULT false,
  finalized_at TIMESTAMPTZ,
  is_sent BOOLEAN DEFAULT false,
  sent_at TIMESTAMPTZ,
  
  notes TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- AI FEATURES
-- ============================================================================

CREATE TABLE ai_interactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_manager_id UUID REFERENCES property_managers(id) ON DELETE CASCADE,
  
  -- Type
  interaction_type TEXT NOT NULL, -- tenant_screening, rent_pricing, maintenance_diagnosis, lease_review
  
  -- Input
  input_data JSONB NOT NULL,
  
  -- Output
  output_data JSONB,
  confidence_score NUMERIC(5, 2),
  
  -- Feedback
  was_helpful BOOLEAN,
  feedback TEXT,
  
  -- Tokens
  tokens_used INTEGER,
  model_used TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- FEATURE TOGGLES FOR PROPERTY MANAGEMENT
-- ============================================================================

-- Add PM features to existing features table
INSERT INTO features (name, display_name, description, category, is_enabled_by_default) VALUES
  ('pm_core', 'Property Management Core', 'Core property management features', 'property_management', false),
  ('pm_residential', 'Residential Property Management', 'Manage residential rental properties', 'property_management', false),
  ('pm_commercial', 'Commercial Property Management', 'Manage commercial rental properties', 'property_management', false),
  ('pm_industrial', 'Industrial Property Management', 'Manage industrial rental properties', 'property_management', false),
  ('pm_maintenance', 'Maintenance System', 'Work order management', 'property_management', false),
  ('pm_accounting', 'PM Accounting', 'Full accounting and financials', 'property_management', false),
  ('pm_tenant_portal', 'Tenant Portal', 'Online tenant access', 'property_management', false),
  ('pm_landlord_portal', 'Owner Portal', 'Property owner access', 'property_management', false),
  ('pm_lease_management', 'Lease Management', 'Digital lease creation and management', 'property_management', false),
  ('pm_inspections', 'Inspections', 'Property inspection system', 'property_management', false),
  ('pm_vendors', 'Vendor Management', 'Vendor tracking and assignment', 'property_management', false),
  ('pm_screening', 'Tenant Screening', 'Background and credit checks', 'property_management', false),
  ('pm_ai_scoring', 'AI Tenant Scoring', 'AI-powered tenant risk assessment', 'property_management', false),
  ('pm_ai_maintenance', 'AI Maintenance', 'AI diagnosis and routing', 'property_management', false),
  ('pm_ai_pricing', 'AI Rent Pricing', 'Market rent recommendations', 'property_management', false),
  ('pm_autopay', 'AutoPay', 'Automated rent collection', 'property_management', false),
  ('pm_syndication', 'Listing Syndication', 'Publish to Zillow, etc.', 'property_management', false),
  ('pm_esign', 'E-Signatures', 'Digital lease signing', 'property_management', false),
  ('pm_reports', 'Advanced Reports', 'Custom reporting and analytics', 'property_management', false),
  ('pm_api_access', 'API Access', 'Developer API access', 'property_management', false)
ON CONFLICT (name) DO NOTHING;

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

-- Property Managers
CREATE INDEX idx_pm_user ON property_managers(user_id);
CREATE INDEX idx_pm_active ON property_managers(is_active);

-- Landlords
CREATE INDEX idx_landlords_pm ON landlords(property_manager_id);
CREATE INDEX idx_landlords_user ON landlords(user_id);

-- Properties
CREATE INDEX idx_properties_pm ON rental_properties(property_manager_id);
CREATE INDEX idx_properties_landlord ON rental_properties(landlord_id);
CREATE INDEX idx_properties_category ON rental_properties(category);
CREATE INDEX idx_properties_city_state ON rental_properties(city, state);
CREATE INDEX idx_properties_address_trgm ON rental_properties USING gin(address gin_trgm_ops);

-- Units
CREATE INDEX idx_units_property ON rental_units(property_id);
CREATE INDEX idx_units_available ON rental_units(is_available, available_date);
CREATE INDEX idx_units_current_lease ON rental_units(current_lease_id);

-- Tenants
CREATE INDEX idx_tenants_pm ON tenants(property_manager_id);
CREATE INDEX idx_tenants_status ON tenants(status);
CREATE INDEX idx_tenants_email ON tenants(email);
CREATE INDEX idx_tenants_name_trgm ON tenants USING gin((first_name || ' ' || last_name) gin_trgm_ops);

-- Leases
CREATE INDEX idx_leases_pm ON leases(property_manager_id);
CREATE INDEX idx_leases_unit ON leases(unit_id);
CREATE INDEX idx_leases_tenant ON leases(tenant_id);
CREATE INDEX idx_leases_status ON leases(status);
CREATE INDEX idx_leases_dates ON leases(start_date, end_date);
CREATE INDEX idx_leases_expiring ON leases(end_date) WHERE status = 'active';

-- Payments
CREATE INDEX idx_payments_pm ON rent_payments(property_manager_id);
CREATE INDEX idx_payments_lease ON rent_payments(lease_id);
CREATE INDEX idx_payments_tenant ON rent_payments(tenant_id);
CREATE INDEX idx_payments_status ON rent_payments(status);
CREATE INDEX idx_payments_due ON rent_payments(due_date);
CREATE INDEX idx_payments_late ON rent_payments(status, days_late) WHERE status = 'late';

-- Maintenance
CREATE INDEX idx_maintenance_pm ON maintenance_requests(property_manager_id);
CREATE INDEX idx_maintenance_property ON maintenance_requests(property_id);
CREATE INDEX idx_maintenance_unit ON maintenance_requests(unit_id);
CREATE INDEX idx_maintenance_status ON maintenance_requests(status);
CREATE INDEX idx_maintenance_priority ON maintenance_requests(priority);
CREATE INDEX idx_maintenance_open ON maintenance_requests(status) WHERE status NOT IN ('completed', 'cancelled');

-- Vendors
CREATE INDEX idx_vendors_pm ON pm_vendors(property_manager_id);
CREATE INDEX idx_vendors_services ON pm_vendors USING gin(services);

-- Activity Log
CREATE INDEX idx_activity_pm ON pm_activity_log(property_manager_id);
CREATE INDEX idx_activity_entity ON pm_activity_log(entity_type, entity_id);
CREATE INDEX idx_activity_date ON pm_activity_log(created_at);

-- ============================================================================
-- ROW LEVEL SECURITY
-- ============================================================================

ALTER TABLE pm_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_managers ENABLE ROW LEVEL SECURITY;
ALTER TABLE landlords ENABLE ROW LEVEL SECURITY;
ALTER TABLE rental_properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE rental_units ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE leases ENABLE ROW LEVEL SECURITY;
ALTER TABLE rent_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE maintenance_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE pm_vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_inspections ENABLE ROW LEVEL SECURITY;
ALTER TABLE pm_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE pm_activity_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE owner_statements ENABLE ROW LEVEL SECURITY;

-- Property Manager access policies
CREATE POLICY pm_own_data ON property_managers
  FOR ALL USING (user_id = auth.uid());

CREATE POLICY pm_properties ON rental_properties
  FOR ALL USING (
    property_manager_id IN (SELECT id FROM property_managers WHERE user_id = auth.uid())
  );

CREATE POLICY pm_units ON rental_units
  FOR ALL USING (
    property_id IN (SELECT id FROM rental_properties WHERE property_manager_id IN 
      (SELECT id FROM property_managers WHERE user_id = auth.uid()))
  );

CREATE POLICY pm_tenants ON tenants
  FOR ALL USING (
    property_manager_id IN (SELECT id FROM property_managers WHERE user_id = auth.uid())
  );

-- Tenant access policies
CREATE POLICY tenant_own ON tenants
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY tenant_leases ON leases
  FOR SELECT USING (
    tenant_id IN (SELECT id FROM tenants WHERE user_id = auth.uid())
  );

CREATE POLICY tenant_payments ON rent_payments
  FOR SELECT USING (
    tenant_id IN (SELECT id FROM tenants WHERE user_id = auth.uid())
  );

CREATE POLICY tenant_maintenance ON maintenance_requests
  FOR ALL USING (
    tenant_id IN (SELECT id FROM tenants WHERE user_id = auth.uid())
  );

-- Landlord access policies
CREATE POLICY landlord_properties ON rental_properties
  FOR SELECT USING (
    landlord_id IN (SELECT id FROM landlords WHERE user_id = auth.uid())
  );

CREATE POLICY landlord_statements ON owner_statements
  FOR SELECT USING (
    landlord_id IN (SELECT id FROM landlords WHERE user_id = auth.uid())
  );

-- ============================================================================
-- FUNCTIONS & TRIGGERS
-- ============================================================================

-- Auto-generate maintenance request numbers
CREATE OR REPLACE FUNCTION generate_maintenance_number()
RETURNS TRIGGER AS $$
BEGIN
  NEW.request_number := 'MR-' || TO_CHAR(NOW(), 'YYYY') || '-' || 
    LPAD(COALESCE(
      (SELECT COUNT(*) + 1 FROM maintenance_requests 
       WHERE property_manager_id = NEW.property_manager_id 
       AND EXTRACT(YEAR FROM created_at) = EXTRACT(YEAR FROM NOW())),
      1
    )::TEXT, 5, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_maintenance_number
  BEFORE INSERT ON maintenance_requests
  FOR EACH ROW
  WHEN (NEW.request_number IS NULL)
  EXECUTE FUNCTION generate_maintenance_number();

-- Update PM stats on property/unit changes
CREATE OR REPLACE FUNCTION update_pm_stats()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE property_managers
  SET 
    properties_managed = (SELECT COUNT(*) FROM rental_properties WHERE property_manager_id = NEW.property_manager_id AND is_active = true),
    units_managed = (SELECT COALESCE(SUM(total_units), 0) FROM rental_properties WHERE property_manager_id = NEW.property_manager_id AND is_active = true),
    updated_at = NOW()
  WHERE id = NEW.property_manager_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_pm_stats_on_property
  AFTER INSERT OR UPDATE OR DELETE ON rental_properties
  FOR EACH ROW
  EXECUTE FUNCTION update_pm_stats();

-- Auto-update unit availability when lease ends
CREATE OR REPLACE FUNCTION update_unit_on_lease_change()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'active' THEN
    UPDATE rental_units SET 
      is_available = false,
      current_lease_id = NEW.id,
      current_tenant_id = NEW.tenant_id,
      current_rent = NEW.monthly_rent
    WHERE id = NEW.unit_id;
  ELSIF NEW.status IN ('expired', 'terminated') THEN
    UPDATE rental_units SET 
      is_available = true,
      current_lease_id = NULL,
      current_tenant_id = NULL,
      available_date = COALESCE(NEW.move_out_date, CURRENT_DATE)
    WHERE id = NEW.unit_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_unit_on_lease
  AFTER UPDATE ON leases
  FOR EACH ROW
  WHEN (OLD.status IS DISTINCT FROM NEW.status)
  EXECUTE FUNCTION update_unit_on_lease_change();

-- Calculate payment balance
CREATE OR REPLACE FUNCTION calculate_payment_balance()
RETURNS TRIGGER AS $$
BEGIN
  NEW.balance_due := NEW.total_amount - NEW.amount_paid;
  IF NEW.balance_due <= 0 THEN
    NEW.status := 'paid';
  ELSIF NEW.amount_paid > 0 THEN
    NEW.status := 'partial';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER calc_payment_balance
  BEFORE INSERT OR UPDATE ON rent_payments
  FOR EACH ROW
  EXECUTE FUNCTION calculate_payment_balance();

-- Log activity
CREATE OR REPLACE FUNCTION log_pm_activity()
RETURNS TRIGGER AS $$
DECLARE
  v_entity_type TEXT;
  v_action TEXT;
BEGIN
  v_entity_type := TG_TABLE_NAME;
  v_action := TG_OP;
  
  INSERT INTO pm_activity_log (property_manager_id, user_id, action, entity_type, entity_id, old_values, new_values)
  VALUES (
    COALESCE(NEW.property_manager_id, OLD.property_manager_id),
    auth.uid(),
    v_action,
    v_entity_type,
    COALESCE(NEW.id, OLD.id),
    CASE WHEN TG_OP = 'DELETE' THEN to_jsonb(OLD) ELSE NULL END,
    CASE WHEN TG_OP != 'DELETE' THEN to_jsonb(NEW) ELSE NULL END
  );
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Apply activity logging to key tables
CREATE TRIGGER log_property_changes
  AFTER INSERT OR UPDATE OR DELETE ON rental_properties
  FOR EACH ROW EXECUTE FUNCTION log_pm_activity();

CREATE TRIGGER log_lease_changes
  AFTER INSERT OR UPDATE OR DELETE ON leases
  FOR EACH ROW EXECUTE FUNCTION log_pm_activity();

CREATE TRIGGER log_payment_changes
  AFTER INSERT OR UPDATE OR DELETE ON rent_payments
  FOR EACH ROW EXECUTE FUNCTION log_pm_activity();

CREATE TRIGGER log_maintenance_changes
  AFTER INSERT OR UPDATE OR DELETE ON maintenance_requests
  FOR EACH ROW EXECUTE FUNCTION log_pm_activity();
