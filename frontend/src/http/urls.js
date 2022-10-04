const BB_API_BASE = 'http://127.0.0.1:8000'
export const LOGIN = `${BB_API_BASE}/auth/login`
export const REGISTER_EMPLOYEE = `${BB_API_BASE}/auth/register`
export const EMPLOYEES_BASE = `${BB_API_BASE}/employees`
export const EMPLOYEE_UPDATE = `${EMPLOYEES_BASE}/:id`
export const EMPLOYEE_PROFILE = `${EMPLOYEES_BASE}/:id/profile`
export const EMPLOYEE_PROFILE_UPLOAD = `${EMPLOYEES_BASE}/:id/profile/upload`
export const EMPLOYEE_PROFILE_DOWNLOAD = `${EMPLOYEES_BASE}/:id/profile/download`
export const EMPLOYEE_CHANGE_PASSWORD = `${EMPLOYEES_BASE}/:id/changePassword`
export const SEARCH_EMPLOYEE_AUTOCOMPLETE = `${EMPLOYEES_BASE}/autocomplete?q=:q`
