import { Auth } from "firebase-admin/auth";
import { auth } from "../../lib/firebase";

export class FirebaseService {
  private auth: Auth;
  constructor() {
    this.auth = auth;

    this.getUserByIdToken = this.getUserByIdToken.bind(this);
    this.getUserByFirebaseUid = this.getUserByFirebaseUid.bind(this);
  }

  public async getUserByIdToken(idToken: string) {
    const decodedToken = await this.auth.verifyIdToken(idToken);
    const user = await this.getUserByFirebaseUid(decodedToken.uid);
    return user;
  }

  public async getUserByFirebaseUid(firebaseUid: string) {
    const user = await this.auth.getUser(firebaseUid);
    return {
      firebaseUid: user.uid,
      email: user.email!,
      name: user.displayName || null,
      photoUrl: user.photoURL,
    };
  }
}

export default FirebaseService;
