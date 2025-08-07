import cors from "cors";

function initCORS() {
  return cors({
    origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  });
}

export default initCORS;
