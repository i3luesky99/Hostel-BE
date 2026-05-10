import { User } from '../../../entities/user.entity';

export type RoomTenantUserView = Pick<
  User,
  'id' | 'email' | 'fullName' | 'phone'
>;

/** Người ở cùng — luôn có tài khoản. */
export type RoomCoTenantEntry = RoomTenantUserView & {
  hasAccount: true;
};

/** Chỉ có khi phòng có hợp đồng `active`. */
export type RoomTenantPayload = {
  contractId: string;
  contractNo: string;
  /** Người đại diện ký hợp đồng — luôn có tài khoản user. */
  representative: RoomTenantUserView;
  /** Người ở cùng — mỗi người một user. */
  coTenants: RoomCoTenantEntry[];
};
