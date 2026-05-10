export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
}

export enum AppRole {
  OWNER = 'owner',
  TENANT = 'tenant',
  ADMIN = 'admin',
}

export enum RoomStatus {
  AVAILABLE = 'available',
  OCCUPIED = 'occupied',
  MAINTENANCE = 'maintenance',
  INACTIVE = 'inactive',
}

export enum ContractStatus {
  DRAFT = 'draft',
  ACTIVE = 'active',
  EXPIRED = 'expired',
  TERMINATED = 'terminated',
}

/** Chỉ số công tơ — nguồn sự thật theo hợp đồng. */
export enum UtilityType {
  ELECTRICITY = 'electricity',
  WATER = 'water',
}

/** Bản chốt sổ tiền theo tháng (contract). */
export enum BillingPeriodStatus {
  DRAFT = 'draft',
  FINALIZED = 'finalized',
  PAID = 'paid',
}
