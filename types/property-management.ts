// CR PROPERTY MANAGEMENT - TYPESCRIPT TYPES
// Created: December 3, 2025
// Complete type definitions for the PM system

// ============================================================================
// ENUMS
// ============================================================================

export type PropertyCategory = 'residential' | 'commercial' | 'industrial';

export type ResidentialType = 
  | 'single_family' 
  | 'apartment' 
  | 'condo' 
  | 'townhouse' 
  | 'duplex' 
  | 'triplex' 
  | 'fourplex' 
  | 'mobile_home' 
  | 'student_housing' 
  | 'senior_living';

export type CommercialType = 
  | 'office' 
  | 'retail' 
  | 'restaurant' 
  | 'medical' 
  | 'mixed_use' 
  | 'hotel_motel' 
  | 'strip_mall' 
  | 'shopping_center';

export type IndustrialType = 
  | 'warehouse' 
  | 'manufacturing' 
  | 'distribution' 
  | 'flex_space' 
  | 'cold_storage' 
  | 'data_center' 
  | 'research_facility';

export type LeaseStatus = 
  | 'draft' 
  | 'pending_signature' 
  | 'active' 
  | 'expiring_soon' 
  | 'expired' 
  | 'terminated' 
  | 'renewed' 
  | 'month_to_month';

export type TenantStatus = 
  | 'prospect' 
  | 'applicant' 
  | 'screening' 
  | 'approved' 
  | 'active' 
  | 'notice_given' 
  | 'moved_out' 
  | 'evicted' 
  | 'rejected';

export type MaintenancePriority = 'emergency' | 'urgent' | 'high' | 'medium' | 'low';

export type MaintenanceStatus = 
  | 'submitted' 
  | 'acknowledged' 
  | 'scheduled' 
  | 'in_progress' 
  | 'pending_parts' 
  | 'completed' 
  | 'cancelled' 
  | 'on_hold';

export type MaintenanceCategory = 
  | 'plumbing' 
  | 'electrical' 
  | 'hvac' 
  | 'appliance' 
  | 'structural' 
  | 'pest' 
  | 'landscaping' 
  | 'cleaning' 
  | 'locksmith' 
  | 'roofing' 
  | 'flooring' 
  | 'painting' 
  | 'windows' 
  | 'doors' 
  | 'other';

export type PaymentStatus = 
  | 'pending' 
  | 'processing' 
  | 'paid' 
  | 'partial' 
  | 'late' 
  | 'failed' 
  | 'refunded' 
  | 'waived' 
  | 'nsf';

export type ApplicationStatus = 
  | 'pending' 
  | 'reviewing' 
  | 'screening' 
  | 'approved' 
  | 'denied' 
  | 'cancelled' 
  | 'waitlisted';

export type InspectionType = 
  | 'move_in' 
  | 'move_out' 
  | 'routine' 
  | 'annual' 
  | 'complaint' 
  | 'pre_listing' 
  | 'periodic';

// ============================================================================
// CORE ENTITIES
// ============================================================================

export interface PropertyManager {
  id: string;
  user_id: string;
  subscription_id?: string;
  company_name?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  license_number?: string;
  license_state?: string;
  license_expiry?: string;
  default_commission_rate: number;
  is_realtor: boolean;
  realtor_profile_id?: string;
  specialties: PropertyCategory[];
  service_areas: string[];
  properties_managed: number;
  units_managed: number;
  active_tenants: number;
  logo_url?: string;
  brand_color: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Landlord {
  id: string;
  user_id?: string;
  property_manager_id: string;
  company_name?: string;
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  tax_id?: string;
  tax_classification?: string;
  payment_method: 'ach' | 'check' | 'hold';
  payment_schedule: 'weekly' | 'biweekly' | 'monthly';
  payment_day: number;
  min_disbursement: number;
  commission_rate?: number;
  portal_access_enabled: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface RentalProperty {
  id: string;
  property_manager_id: string;
  landlord_id?: string;
  property_code?: string;
  name?: string;
  address: string;
  address_line2?: string;
  city: string;
  state: string;
  zip: string;
  county?: string;
  country: string;
  latitude?: number;
  longitude?: number;
  category: PropertyCategory;
  residential_type?: ResidentialType;
  commercial_type?: CommercialType;
  industrial_type?: IndustrialType;
  year_built?: number;
  total_units: number;
  total_sqft?: number;
  lot_size?: number;
  lot_size_unit: 'sqft' | 'acres';
  stories: number;
  parking_spaces: number;
  parking_type?: string;
  purchase_price?: number;
  purchase_date?: string;
  current_value?: number;
  property_tax_annual?: number;
  insurance_annual?: number;
  hoa_monthly?: number;
  utilities_included: string[];
  amenities: string[];
  is_active: boolean;
  listing_status: 'not_listed' | 'listed' | 'leased';
  images: PropertyImage[];
  documents: PropertyDocument[];
  virtual_tour_url?: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface PropertyImage {
  id: string;
  url: string;
  caption?: string;
  is_primary: boolean;
}

export interface PropertyDocument {
  id: string;
  name: string;
  url: string;
  type: string;
  uploaded_at: string;
}

export interface RentalUnit {
  id: string;
  property_id: string;
  unit_number: string;
  unit_name?: string;
  unit_code?: string;
  floor?: number;
  bedrooms: number;
  bathrooms: number;
  half_baths: number;
  sqft?: number;
  market_rent?: number;
  current_rent?: number;
  security_deposit?: number;
  is_available: boolean;
  available_date?: string;
  listing_status: 'not_listed' | 'listed' | 'leased';
  current_lease_id?: string;
  current_tenant_id?: string;
  amenities: string[];
  appliances: string[];
  has_washer_dryer: boolean;
  has_dishwasher: boolean;
  has_ac: boolean;
  has_heating: boolean;
  pet_policy: 'no_pets' | 'cats_only' | 'dogs_only' | 'small_pets' | 'all_pets';
  pet_deposit?: number;
  pet_rent_monthly?: number;
  parking_spaces: number;
  parking_fee?: number;
  storage_included: boolean;
  storage_fee?: number;
  images: PropertyImage[];
  floor_plan_url?: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface Tenant {
  id: string;
  user_id?: string;
  property_manager_id: string;
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
  alternate_phone?: string;
  date_of_birth?: string;
  employer?: string;
  job_title?: string;
  monthly_income?: number;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  emergency_contact_relationship?: string;
  status: TenantStatus;
  credit_score?: number;
  background_check_date?: string;
  background_check_status?: string;
  income_verified: boolean;
  ai_tenant_score?: number;
  ai_score_factors?: Record<string, any>;
  portal_access_enabled: boolean;
  last_portal_login?: string;
  photo_url?: string;
  documents: TenantDocument[];
  tags: string[];
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface TenantDocument {
  id: string;
  name: string;
  url: string;
  type: string;
  uploaded_at: string;
}

export interface CoTenant {
  id: string;
  primary_tenant_id: string;
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
  date_of_birth?: string;
  relationship: string;
  is_on_lease: boolean;
  is_adult: boolean;
  created_at: string;
}

export interface Lease {
  id: string;
  property_manager_id: string;
  property_id: string;
  unit_id: string;
  tenant_id: string;
  lease_type: 'fixed' | 'month_to_month' | 'week_to_week';
  start_date: string;
  end_date?: string;
  move_in_date?: string;
  move_out_date?: string;
  monthly_rent: number;
  security_deposit?: number;
  security_deposit_paid: boolean;
  pet_deposit?: number;
  rent_due_day: number;
  grace_period_days: number;
  late_fee_type: 'flat' | 'percentage' | 'daily';
  late_fee_amount?: number;
  late_fee_percentage?: number;
  pet_rent?: number;
  parking_fee?: number;
  storage_fee?: number;
  status: LeaseStatus;
  signed_date?: string;
  auto_renew: boolean;
  lease_document_url?: string;
  signed_lease_url?: string;
  termination_date?: string;
  termination_reason?: string;
  deposit_refund_amount?: number;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface RentPayment {
  id: string;
  property_manager_id: string;
  lease_id: string;
  tenant_id: string;
  property_id: string;
  unit_id: string;
  billing_period_start: string;
  billing_period_end: string;
  due_date: string;
  rent_amount: number;
  late_fee: number;
  pet_rent: number;
  parking_fee: number;
  storage_fee: number;
  utilities: number;
  other_charges: number;
  credits: number;
  total_amount: number;
  amount_paid: number;
  balance_due: number;
  payment_date?: string;
  status: PaymentStatus;
  days_late: number;
  payment_method?: string;
  transaction_id?: string;
  is_autopay: boolean;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface MaintenanceRequest {
  id: string;
  property_manager_id: string;
  property_id: string;
  unit_id?: string;
  tenant_id?: string;
  request_number: string;
  title: string;
  description: string;
  category: MaintenanceCategory;
  priority: MaintenancePriority;
  status: MaintenanceStatus;
  location_in_unit?: string;
  scheduled_date?: string;
  scheduled_time_start?: string;
  scheduled_time_end?: string;
  completed_date?: string;
  assigned_to?: string;
  vendor_id?: string;
  permission_to_enter: boolean;
  entry_instructions?: string;
  estimated_cost?: number;
  actual_cost?: number;
  labor_cost?: number;
  materials_cost?: number;
  tenant_responsible: boolean;
  tenant_charge_amount?: number;
  resolution_notes?: string;
  ai_diagnosis?: string;
  ai_estimated_cost?: number;
  tenant_satisfaction?: number;
  tenant_feedback?: string;
  images: string[];
  completion_images: string[];
  notes?: string;
  internal_notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Vendor {
  id: string;
  property_manager_id: string;
  company_name: string;
  contact_name?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  services: MaintenanceCategory[];
  service_description?: string;
  license_number?: string;
  insurance_policy?: string;
  insurance_expiry?: string;
  w9_on_file: boolean;
  hourly_rate?: number;
  emergency_rate?: number;
  minimum_charge?: number;
  payment_terms: string;
  jobs_completed: number;
  average_rating?: number;
  is_preferred: boolean;
  is_active: boolean;
  emergency_available: boolean;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface PropertyInspection {
  id: string;
  property_manager_id: string;
  property_id: string;
  unit_id?: string;
  lease_id?: string;
  tenant_id?: string;
  inspection_type: InspectionType;
  scheduled_date?: string;
  completed_date?: string;
  inspector_id?: string;
  overall_condition?: 'excellent' | 'good' | 'fair' | 'poor';
  cleanliness_score?: number;
  damages_found: boolean;
  damage_items: DamageItem[];
  damage_cost_estimate?: number;
  tenant_responsible_amount?: number;
  photos: string[];
  report_url?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface DamageItem {
  id: string;
  location: string;
  description: string;
  severity: 'minor' | 'moderate' | 'severe';
  estimated_cost: number;
  photos: string[];
}

export interface OwnerStatement {
  id: string;
  property_manager_id: string;
  landlord_id: string;
  statement_date: string;
  period_start: string;
  period_end: string;
  properties: string[];
  rental_income: number;
  late_fees_collected: number;
  other_income: number;
  total_income: number;
  management_fee: number;
  maintenance_costs: number;
  repairs: number;
  utilities: number;
  insurance: number;
  property_tax: number;
  other_expenses: number;
  total_expenses: number;
  net_income: number;
  owner_draw: number;
  reserve_held: number;
  ending_balance: number;
  disbursement_date?: string;
  statement_url?: string;
  is_finalized: boolean;
  is_sent: boolean;
  created_at: string;
  updated_at: string;
}

// ============================================================================
// API RESPONSE TYPES
// ============================================================================

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}

export interface DashboardStats {
  total_properties: number;
  total_units: number;
  occupied_units: number;
  occupancy_rate: number;
  active_leases: number;
  expiring_leases: number;
  rent_collected_mtd: number;
  rent_outstanding: number;
  open_maintenance: number;
  emergency_maintenance: number;
  active_tenants: number;
  new_applicants: number;
}

export interface PropertySummary {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  category: PropertyCategory;
  type: string;
  units: number;
  occupied_units: number;
  monthly_revenue: number;
  occupancy_rate: number;
}

export interface TenantSummary {
  id: string;
  name: string;
  email: string;
  phone: string;
  unit: string;
  property: string;
  lease_end: string;
  balance: number;
  status: TenantStatus;
}

export interface PaymentSummary {
  id: string;
  tenant: string;
  unit: string;
  property: string;
  amount: number;
  due_date: string;
  status: PaymentStatus;
  days_late: number;
}

export interface MaintenanceSummary {
  id: string;
  request_number: string;
  title: string;
  property: string;
  unit?: string;
  tenant?: string;
  category: MaintenanceCategory;
  priority: MaintenancePriority;
  status: MaintenanceStatus;
  created_at: string;
}

// ============================================================================
// FORM TYPES
// ============================================================================

export interface CreatePropertyInput {
  name?: string;
  address: string;
  address_line2?: string;
  city: string;
  state: string;
  zip: string;
  category: PropertyCategory;
  residential_type?: ResidentialType;
  commercial_type?: CommercialType;
  industrial_type?: IndustrialType;
  total_units: number;
  landlord_id?: string;
}

export interface CreateTenantInput {
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
  date_of_birth?: string;
}

export interface CreateLeaseInput {
  property_id: string;
  unit_id: string;
  tenant_id: string;
  start_date: string;
  end_date?: string;
  monthly_rent: number;
  security_deposit?: number;
}

export interface CreateMaintenanceInput {
  property_id: string;
  unit_id?: string;
  tenant_id?: string;
  title: string;
  description: string;
  category: MaintenanceCategory;
  priority: MaintenancePriority;
  permission_to_enter?: boolean;
}

export interface RecordPaymentInput {
  lease_id: string;
  amount: number;
  payment_method: string;
  payment_date: string;
}
