import { initializeApp, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import path from "path";

const serviceAccountPath = path.join(
  __dirname,
  "..",
  "secrets",
  "firebase-admin.json"
);

const firebaseApp = initializeApp({
  credential: cert(serviceAccountPath),
});

const auth = getAuth(firebaseApp);

export { auth };
