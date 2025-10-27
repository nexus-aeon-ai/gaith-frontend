import type { IUserSetting } from "@/lib/api/settings";
import type { GeneralTabFormData, NotificationTabFormData, SecurityTabFormData } from "@/lib/validations/settings";

/**
 * Transforms form data from GeneralTabForm to the API format expected by the settings endpoint
 * @param formData - The form data from GeneralTabForm
 * @returns Array of IUserSetting objects in the format expected by the API
 */
export const transformGeneralFormToSettingsAPI = (
  formData: GeneralTabFormData,
): IUserSetting[] => {
  const settings: IUserSetting[] = [];

  // User Profile Settings
  if (formData.fullName) {
    settings.push({
      key: "fullName",
      value: formData.fullName,
      category: "profile",
    });
  }

  if (formData.email) {
    settings.push({
      key: "email",
      value: formData.email,
      category: "profile",
    });
  }

  if (formData.jobTitle) {
    settings.push({
      key: "jobTitle",
      value: formData.jobTitle,
      category: "profile",
    });
  }

  if (formData.department) {
    settings.push({
      key: "department",
      value: formData.department,
      category: "profile",
    });
  }

  // Language and Regional Settings
  if (formData.interfaceLang) {
    settings.push({
      key: "interfaceLang",
      value: formData.interfaceLang,
      category: "regional",
    });
  }

  if (formData.textDirection) {
    settings.push({
      key: "textDirection",
      value: formData.textDirection,
      category: "regional",
    });
  }

  // Theme Preferences
  if (formData.darkThemeStatus !== undefined) {
    settings.push({
      key: "theme",
      value: formData.darkThemeStatus ? "dark" : "light",
      category: "appearance",
    });
  }

  // Data Export Settings
  if (formData.defaultExport) {
    settings.push({
      key: "defaultExport",
      value: formData.defaultExport,
      category: "export",
    });
  }

  if (formData.includeMetaData !== undefined) {
    settings.push({
      key: "includeMetaData",
      value: formData.includeMetaData.toString(),
      category: "export",
    });
  }

  return settings;
};

/**
 * Transforms settings API response to form data format
 * @param settings - Array of IUserSetting from API
 * @returns Partial form data that can be used to populate the form
 */
export const transformSettingsAPIToFormData = (
  settings: IUserSetting[],
): Partial<GeneralTabFormData> => {
  const formData: Partial<GeneralTabFormData> = {};

  settings.forEach((setting) => {
    switch (setting.key) {
      // Handle both camelCase and snake_case for fullName
      case "fullName":
      case "full_name":
        formData.fullName = setting.value;
        break;
        
      case "email":
        formData.email = setting.value;
        break;
        
      // Handle both camelCase and snake_case for jobTitle  
      case "jobTitle":
      case "job_title":
        formData.jobTitle = setting.value;
        break;
        
      case "department":
        // Ensure the department value matches one of the allowed enum values
        const validDepartments = ["Sales", "Marketing", "Engineering", "HR", "Finance", "Operations", "IT", "Other"];
        const departmentValue = setting.value;
        
        // Skip if value is empty, null, or undefined
        if (!departmentValue || departmentValue.trim() === "") {
          console.log("Department value is empty, using default 'Sales'");
          formData.department = "Sales" as any;
          break;
        }
        
        // Check if the value matches exactly
        if (validDepartments.includes(departmentValue)) {
          formData.department = departmentValue as any;
        } else {
          // Try to find a case-insensitive match
          const matchedDepartment = validDepartments.find(
            dept => dept.toLowerCase() === departmentValue.toLowerCase(),
          );
          if (matchedDepartment) {
            formData.department = matchedDepartment as any;
          } else {
            console.warn(`Department value "${departmentValue}" not found in valid options:`, validDepartments);
            // Set to default if no match found
            formData.department = "Sales" as any;
          }
        }
        break;
        
      // Handle both camelCase and snake_case for interfaceLang
      case "interfaceLang":
      case "interface_language":
        // Map API values to form values
        if (setting.value === "EN" || setting.value === "English") {
          formData.interfaceLang = "English";
        } else if (setting.value === "AR" || setting.value === "Arabic") {
          formData.interfaceLang = "Arabic";
        }
        break;
        
      // Handle both camelCase and snake_case for textDirection
      case "textDirection":
      case "text_direction":
        // Map API values to form values
        if (setting.value === "LTR" || setting.value === "left-to-right") {
          formData.textDirection = "left-to-right";
        } else if (setting.value === "RTL" || setting.value === "right-to-left") {
          formData.textDirection = "right-to-left";
        }
        break;
        
      // Handle both camelCase and snake_case for theme/dark mode
      case "theme":
      case "dark_mode":
        formData.darkThemeStatus = setting.value === "dark" || setting.value === "true";
        break;
        
      // Handle both camelCase and snake_case for defaultExport
      case "defaultExport":
      case "default_export_format":
        // Map API values to form values
        if (setting.value.toLowerCase() === "xlsx") {
          formData.defaultExport = "XLSX";
        } else if (setting.value.toLowerCase() === "pdf") {
          formData.defaultExport = "PDF";
        }
        break;
        
      // Handle both camelCase and snake_case for includeMetaData
      case "includeMetaData":
      case "include_metadata":
        formData.includeMetaData = setting.value === "true" || setting.value === "1" || String(setting.value) === "1";
        break;
    }
  });

  return formData;
};

/**
 * Transforms form data from NotificationTabForm to the API format expected by the settings endpoint
 * @param formData - The form data from NotificationTabForm
 * @returns Array of IUserSetting objects in the format expected by the API
 */
export const transformNotificationFormToSettingsAPI = (
  formData: NotificationTabFormData,
): IUserSetting[] => {
  const settings: IUserSetting[] = [];

  // Email notifications
  settings.push({
    key: "newClientAdded",
    value: String(formData.newClientAdded),
    category: "notifications",
  });

  settings.push({
    key: "clientStatusChanged",
    value: String(formData.clientStatusChanged),
    category: "notifications",
  });

  settings.push({
    key: "weeklyReports",
    value: String(formData.weeklyReports),
    category: "notifications",
  });

  // SMS notifications
  settings.push({
    key: "enableSMSAlerts",
    value: String(formData.enableSMSAlerts),
    category: "notifications",
  });

  settings.push({
    key: "playSoundOnSMS",
    value: String(formData.playSoundOnSMS),
    category: "notifications",
  });

  if (formData.phoneNumber && formData.phoneNumber.trim() !== "") {
    settings.push({
      key: "phoneNumber",
      value: formData.phoneNumber,
      category: "notifications",
    });
  }

  // In-app notifications
  settings.push({
    key: "desktopNotifications",
    value: String(formData.desktopNotifications),
    category: "notifications",
  });

  settings.push({
    key: "soundAlerts",
    value: String(formData.soundAlerts),
    category: "notifications",
  });

  settings.push({
    key: "notificationFrequency",
    value: formData.notificationFrequency,
    category: "notifications",
  });

  return settings;
};

/**
 * Transforms settings API response to NotificationTabForm data format
 * @param settings - Array of IUserSetting objects from the API
 * @returns Partial NotificationTabFormData object
 */
export const transformSettingsAPIToNotificationFormData = (
  settings: IUserSetting[],
): Partial<NotificationTabFormData> => {
  const formData: Partial<NotificationTabFormData> = {};

  settings.forEach((setting) => {
    switch (setting.key) {
      case "newClientAdded":
      case "new_client_added":
        formData.newClientAdded = setting.value === "true" || setting.value === "1" || String(setting.value) === "1";
        break;
      case "clientStatusChanged":
      case "client_status_changed":
        formData.clientStatusChanged = setting.value === "true" || setting.value === "1" || String(setting.value) === "1";
        break;
      case "weeklyReports":
      case "weekly_reports":
        formData.weeklyReports = setting.value === "true" || setting.value === "1" || String(setting.value) === "1";
        break;
      case "enableSMSAlerts":
      case "enable_sms_alerts":
        formData.enableSMSAlerts = setting.value === "true" || setting.value === "1" || String(setting.value) === "1";
        break;
      case "playSoundOnSMS":
      case "play_sound_on_sms":
        formData.playSoundOnSMS = setting.value === "true" || setting.value === "1" || String(setting.value) === "1";
        break;
      case "phoneNumber":
      case "phone_number":
        formData.phoneNumber = setting.value || "";
        break;
      case "desktopNotifications":
      case "desktop_notifications":
        formData.desktopNotifications = setting.value === "true" || setting.value === "1" || String(setting.value) === "1";
        break;
      case "soundAlerts":
      case "sound_alerts":
        formData.soundAlerts = setting.value === "true" || setting.value === "1" || String(setting.value) === "1";
        break;
      case "notificationFrequency":
      case "notification_frequency":
        const validFrequencies = ["5min", "15min", "1hr", "4hrs", "12hrs", "24hrs"];
        if (validFrequencies.includes(setting.value)) {
          formData.notificationFrequency = setting.value as any;
        } else {
          // Map common variations
          if (setting.value === "5" || setting.value === "5_minutes") {
            formData.notificationFrequency = "5min";
          } else if (setting.value === "15" || setting.value === "15_minutes") {
            formData.notificationFrequency = "15min";
          } else if (setting.value === "1" || setting.value === "1_hour") {
            formData.notificationFrequency = "1hr";
          } else if (setting.value === "4" || setting.value === "4_hours") {
            formData.notificationFrequency = "4hrs";
          } else if (setting.value === "12" || setting.value === "12_hours") {
            formData.notificationFrequency = "12hrs";
          } else if (setting.value === "24" || setting.value === "24_hours") {
            formData.notificationFrequency = "24hrs";
          } else {
            formData.notificationFrequency = "5min"; // default fallback
          }
        }
        break;
    }
  });

  return formData;
};

/**
 * Transforms form data from SecurityTabForm to the API format expected by the settings endpoint
 * @param formData - The form data from SecurityTabForm
 * @returns Array of IUserSetting objects in the format expected by the API
 */
export const transformSecurityFormToSettingsAPI = (
  formData: SecurityTabFormData,
): IUserSetting[] => {
  const settings: IUserSetting[] = [];

  // Two-factor authentication
  settings.push({
    key: "twoFactorAuth",
    value: String(formData.twoFactorAuth),
    category: "security",
  });

  // Password fields - only include if they have values
  if (formData.currentPassword && formData.currentPassword.trim() !== "") {
    settings.push({
      key: "currentPassword",
      value: formData.currentPassword,
      category: "security",
    });
  }

  if (formData.newPassword && formData.newPassword.trim() !== "") {
    settings.push({
      key: "newPassword",
      value: formData.newPassword,
      category: "security",
    });
  }

  if (formData.confirmPassword && formData.confirmPassword.trim() !== "") {
    settings.push({
      key: "confirmPassword",
      value: formData.confirmPassword,
      category: "security",
    });
  }

  return settings;
};

/**
 * Transforms settings API response to SecurityTabForm data format
 * @param settings - Array of IUserSetting objects from the API
 * @returns Partial SecurityTabFormData object
 */
export const transformSettingsAPIToSecurityFormData = (
  settings: IUserSetting[],
): Partial<SecurityTabFormData> => {
  const formData: Partial<SecurityTabFormData> = {};

  settings.forEach((setting) => {
    switch (setting.key) {
      case "twoFactorAuth":
      case "two_factor_auth":
        formData.twoFactorAuth = setting.value === "true" || setting.value === "1" || String(setting.value) === "1";
        break;
      case "currentPassword":
      case "current_password":
        formData.currentPassword = setting.value || "";
        break;
      case "newPassword":
      case "new_password":
        formData.newPassword = setting.value || "";
        break;
      case "confirmPassword":
      case "confirm_password":
        formData.confirmPassword = setting.value || "";
        break;
    }
  });

  return formData;
};