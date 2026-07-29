// Firebase Authentication Module for Admin Dashboard
import { auth } from './firebase-config.js';
import {
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  reauthenticateWithCredential,
  EmailAuthProvider
} from 'firebase/auth';

/**
 * Sign in with email and password
 */
export async function loginWithEmail(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { success: true, user: userCredential.user };
  } catch (error) {
    let message = 'Login failed. Please try again.';
    switch (error.code) {
      case 'auth/invalid-email':
        message = 'Invalid email address format.';
        break;
      case 'auth/user-disabled':
        message = 'This account has been disabled.';
        break;
      case 'auth/user-not-found':
        message = 'No account found with this email.';
        break;
      case 'auth/wrong-password':
        message = 'Incorrect password.';
        break;
      case 'auth/invalid-credential':
        message = 'Invalid email or password.';
        break;
      case 'auth/too-many-requests':
        message = 'Too many failed attempts. Please try again later.';
        break;
    }
    return { success: false, error: message };
  }
}

/**
 * Sign out the current user
 */
export async function logoutUser() {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * Listen for auth state changes
 */
export function onAuthChange(callback) {
  return onAuthStateChanged(auth, callback);
}

/**
 * Get the current authenticated user
 */
export function getCurrentUser() {
  return auth.currentUser;
}

/**
 * Re-verify the signed-in user's password.
 *
 * The Admin SDK cannot check a password, so self-service password changes prove
 * "you are really this person" here in the browser and the Cloud Function then
 * enforces that the resulting token's `auth_time` is fresh. Callers must run
 * this immediately before calling changeB2BAgentPassword.
 *
 * @param {string} currentPassword
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export async function reauthenticateCurrentUser(currentPassword) {
  const user = auth.currentUser;
  if (!user?.email) return { success: false, error: 'You are not signed in.' };

  try {
    await reauthenticateWithCredential(user, EmailAuthProvider.credential(user.email, currentPassword));
    // Force a token refresh so the callable sees the reauthenticated auth_time
    // rather than a cached token minted at the original sign-in.
    await user.getIdToken(true);
    return { success: true };
  } catch (error) {
    switch (error.code) {
      case 'auth/wrong-password':
      case 'auth/invalid-credential':
        return { success: false, error: 'Your current password is incorrect.' };
      case 'auth/too-many-requests':
        return { success: false, error: 'Too many attempts. Please wait a few minutes and try again.' };
      case 'auth/user-disabled':
        return { success: false, error: 'This account has been deactivated.' };
      default:
        return { success: false, error: error.message || 'Could not verify your current password.' };
    }
  }
}
