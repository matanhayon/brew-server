// middlewares/logger.js
export function loggerMiddleware(req, _res, next) {
  const { method, url, body, params, query } = req;
  const timestamp = new Date().toISOString();

  console.log("📥 Incoming Request:");
  console.log(`🕒 Time: ${timestamp}`);
  console.log(`➡️ Method: ${method}`);
  console.log(`📍 URL: ${url}`);

  if (params && Object.keys(params).length > 0) {
    console.log("🧩 Params:", params);
  }

  if (query && Object.keys(query).length > 0) {
    console.log("🔎 Query:", query);
  }

  if (body && typeof body === "object" && Object.keys(body).length > 0) {
    console.log("📝 Body:", body);
  }

  console.log("--------------------------------------------------");

  next();
}
