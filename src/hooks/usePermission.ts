import { useAuthStore } from "@/lib/store/authStore";

type PermissionAction = "view" | "add" | "edit" | "delete";

interface PermissionResult {
  canView: boolean;
  canAdd: boolean;
  canEdit: boolean;
  canDelete: boolean;
  hasPermission: (action: PermissionAction) => boolean;
}

export const usePermission = (resource: string): PermissionResult => {
  const { user } = useAuthStore();
  const permissions = user?.permissions || [];

  const hasPermission = (action: PermissionAction): boolean => {
    // If user has no permissions, deny all
    if (!permissions.length) return false;

    // Map actions to permission suffixes
    // view -> read
    // add -> create
    // edit -> update
    // delete -> delete
    let suffix = "";
    switch (action) {
      case "view":
        suffix = "read";
        break;
      case "add":
        suffix = "create";
        break;
      case "edit":
        suffix = "update";
        break;
      case "delete":
        suffix = "delete";
        break;
    }

    const permissionString = `${resource}.${suffix}`;
    return permissions.includes(permissionString);
  };

  return {
    canView: hasPermission("view"),
    canAdd: hasPermission("add"),
    canEdit: hasPermission("edit"),
    canDelete: hasPermission("delete"),
    hasPermission,
  };
};
