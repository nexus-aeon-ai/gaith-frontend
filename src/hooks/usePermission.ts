import { useAuthStore } from "@/lib/store/authStore";

const USE_MOCK_PERMISSIONS = true;

const MOCK_PERMISSIONS = [
  "dashboard.read", "dashboard.create", "dashboard.update", "dashboard.delete",
  "tasks.read", "tasks.create", "tasks.update", "tasks.delete",
  // "reports.read", "reports.create", "reports.update", "reports.delete",
  "leads.read", "leads.create", "leads.update", "leads.delete",
  "clients.read", "clients.create", "clients.update", "clients.delete",
  // "employees.read", "employees.create", "employees.update", "employees.delete",
  "employee_tasks.read", "employee_tasks.create", "employee_tasks.update", "employee_tasks.delete",
  "quotations.read", "quotations.create", "quotations.update", "quotations.delete",
  "submitted.read", "submitted.create", "submitted.update", "submitted.delete",
  "marketing_assets.read", "marketing_assets.create", "marketing_assets.update", "marketing_assets.delete",
  "social_media.read", "social_media.create", "social_media.update", "social_media.delete",
  "blog.read", "blog.create", "blog.update", "blog.delete",
  "marketing_plans.read", "marketing_plans.create", "marketing_plans.update", "marketing_plans.delete",
  "media_buying.read", "media_buying.create", "media_buying.update", "media_buying.delete",
  "chatbot.read", "chatbot.create", "chatbot.update", "chatbot.delete",
  "settings.read", "settings.create", "settings.update", "settings.delete"
];

type PermissionAction = "view" | "add" | "edit" | "delete";

interface PermissionResult {
  canView: boolean;
  canAdd: boolean;
  canEdit: boolean;
  canDelete: boolean;
  hasPermission: (action: PermissionAction) => boolean;
}

export const useUserPermissions = () => {
  const { user } = useAuthStore();
  const userPermissions = user?.permissions || [];
  return USE_MOCK_PERMISSIONS ? MOCK_PERMISSIONS : userPermissions;
};

export const usePermission = (resource: string): PermissionResult => {
  const permissions = useUserPermissions();

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
