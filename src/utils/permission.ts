import { usePermissionStore } from '@/store/permission';

export const hasPerm = (key: string) => {
  if (!key) return true;
  return usePermissionStore()?.perms?.includes?.(key);
};
