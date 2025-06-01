
// External models for API responses - Authentication
export interface ExternalLoginResponse {
  access_token: string;
  user: {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
    first_name?: string;
    last_name?: string;
    fullname?: string;
    phone?: string;
    roles?: string[];
  };
}

export interface ExternalRegisterResponse {
  access_token: string;
  user: {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
    first_name?: string;
    last_name?: string;
    fullname?: string;
    phone?: string;
    roles?: string[];
  };
}

export interface ExternalUserResponse {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  first_name?: string;
  last_name?: string;
  fullname?: string;
  phone?: string;
  roles?: string[];
  created_at?: string;
  updated_at?: string;
}
