declare namespace NodeJS {
  export interface ProcessEnv {
    PORT: string;
    MONGODB_URI: string;
    DB_NAME?: string;
    ACCESS_TOKEN_SECRET?: string;
    REFRESH_TOKEN_SECRET?: string;
  }
}
