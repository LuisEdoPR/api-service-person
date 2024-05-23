export type EnvironmentVariables = {
    DATABASE_URL: string;
    ENVIRONMENT: string
  };
  
  declare global {
    namespace NodeJS {
      type ProcessEnv = EnvironmentVariables;
    }
  }
  
  export {};
  