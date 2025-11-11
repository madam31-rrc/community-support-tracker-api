export interface Address {
  street?: string;
  city?: string;
  province?: string;
  postalCode?: string;
  country?: string;
}

export interface Organization {
  id: string;
  name: string;
  slug: string;
  description?: string;
  address?: Address;
  contactEmail?: string;
  contactPhone?: string;
  website?: string;
  digestEnabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateOrganizationDTO {
  name: string;
  slug: string;
  description?: string;
  address?: Address;
  contactEmail?: string;
  contactPhone?: string;
  website?: string;
  digestEnabled?: boolean;
}

export interface UpdateOrganizationDTO {
  name?: string;
  slug?: string;
  description?: string;
  address?: Address;
  contactEmail?: string;
  contactPhone?: string;
  website?: string;
  digestEnabled?: boolean;
}

export interface OrganizationSummary {
  id: string;
  name: string;
  totalEvents: number;
  totalVolunteers: number;
  totalDonations: number;
  totalDonationAmount: number;
}