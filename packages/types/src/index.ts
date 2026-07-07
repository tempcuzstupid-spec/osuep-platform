// Cross-package shared types

export type Role = 'org_admin' | 'buyer' | 'approver' | 'finance' | 'employee' | 'viewer';

export type SessionState = 'active' | 'pending_mfa' | 'expired' | 'revoked';

export type OrgType =
  | 'company'
  | 'school'
  | 'hospital'
  | 'hotel'
  | 'government'
  | 'enterprise'
  | 'small_business';
