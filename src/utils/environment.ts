export const PROD_ENVIRONMENT = 'PROD';
export const DEV_ENVIRONMENT = 'DEV';

export function isProdEnvironment(): boolean {
    console.log("\n\n\n\n\nENVIRONMENT --> " + process.env.ENVIRONMENT);
    return process.env.ENVIRONMENT===PROD_ENVIRONMENT;
}