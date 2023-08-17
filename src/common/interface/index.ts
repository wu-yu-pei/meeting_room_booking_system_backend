export interface JwtUserData {
  userId: number;
  username: string;
  roles: string[];
  permissions: string[];
}

export interface RefreshTokenJwtPayload {
  userId: number;
}

export interface AccessTokenJwtPayload {
  id: number;
  username: string;
  roles: string[];
  permissions: string[];
}
