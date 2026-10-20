export function getEnv(name: keyof ImportMetaEnv): string | undefined {
  const metaEnv = import.meta.env as
    | Record<string, string | undefined>
    | undefined;
  return metaEnv?.[name] ?? process.env[name];
}
