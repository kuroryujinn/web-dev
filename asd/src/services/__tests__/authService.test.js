import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from 'firebase/auth';
import {
  logout,
  registerWithEmail,
  signInWithEmail,
  signInWithGoogle,
} from '../authService';
import { auth, googleProvider } from '../firebase';

vi.mock('firebase/auth', () => ({
  signInWithPopup: vi.fn(),
  signInWithEmailAndPassword: vi.fn(),
  createUserWithEmailAndPassword: vi.fn(),
  signOut: vi.fn(),
  updateProfile: vi.fn(),
}));

vi.mock('../firebase', () => ({
  auth: { fake: 'auth-instance' },
  googleProvider: { fake: 'google-provider' },
}));

const fakeUser = { uid: 'uid-1', displayName: 'Alex', email: 'alex@example.com' };

describe('authService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('signInWithGoogle', () => {
    it('calls signInWithPopup with the auth instance and Google provider, returning the user', async () => {
      signInWithPopup.mockResolvedValue({ user: fakeUser });

      const user = await signInWithGoogle();

      expect(signInWithPopup).toHaveBeenCalledWith(auth, googleProvider);
      expect(user).toBe(fakeUser);
    });
  });

  describe('signInWithEmail', () => {
    it('calls signInWithEmailAndPassword with auth, email, and password, returning the user', async () => {
      signInWithEmailAndPassword.mockResolvedValue({ user: fakeUser });

      const user = await signInWithEmail('alex@example.com', 'secret1');

      expect(signInWithEmailAndPassword).toHaveBeenCalledWith(
        auth,
        'alex@example.com',
        'secret1'
      );
      expect(user).toBe(fakeUser);
    });
  });

  describe('registerWithEmail', () => {
    it('creates the user and updates the display name, returning the user', async () => {
      createUserWithEmailAndPassword.mockResolvedValue({ user: fakeUser });
      updateProfile.mockResolvedValue(undefined);

      const user = await registerWithEmail('alex@example.com', 'secret1', 'Alex');

      expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(
        auth,
        'alex@example.com',
        'secret1'
      );
      expect(updateProfile).toHaveBeenCalledWith(fakeUser, { displayName: 'Alex' });
      expect(user).toBe(fakeUser);
    });
  });

  describe('logout', () => {
    it('calls signOut with the auth instance', async () => {
      signOut.mockResolvedValue(undefined);

      await logout();

      expect(signOut).toHaveBeenCalledWith(auth);
    });
  });
});
