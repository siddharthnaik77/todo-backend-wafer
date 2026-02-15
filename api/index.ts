import app from "../src/app";

export default async function handler(req: any, res: any) {
  // Set timeout headers for Vercel
  res.setHeader('Connection', 'close');
  
  return new Promise((resolve) => {
    const result = app(req, res);
    if (result instanceof Promise) {
      result.then(() => resolve(null)).catch(() => resolve(null));
    } else {
      res.on('finish', () => resolve(null));
    }
  });
}
