export default async (req, res) => {
  const { reqHandler } = await import('../dist/feeldown/server/server.mjs');
  return reqHandler(req, res);
};
