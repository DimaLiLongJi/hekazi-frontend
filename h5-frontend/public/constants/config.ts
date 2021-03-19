export const Config = {
  pageRoot: `${(process.env.config as any).baseUrl}`,
  publicPath: `${(process.env.config as any).publicPath}`,
  serverRoot: `${(process.env.config as any).serverUrl}`,
  staticPath: `${(process.env.config as any).staticPath}`,
};
