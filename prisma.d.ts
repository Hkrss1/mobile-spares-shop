declare module 'prisma' {
    export const defineConfig: (config: Record<string, unknown>) => Record<string, unknown>;
    export const env: (key: string) => string | undefined;
}
