import React, { useState } from 'react';
import { auth, db, handleFirestoreError, OperationType } from '../firebase';
import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { Mail, Lock, User, LogIn, UserPlus, AlertCircle, CheckCircle, ExternalLink, HelpCircle, ChevronDown, ChevronUp, Copy, Check } from 'lucide-react';
import firebaseConfig from '../../firebase-applet-config.json';

interface AuthSectionProps {
  onSuccess: () => void;
}

export default function AuthSection({ onSuccess }: AuthSectionProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSetupInstructions, setShowSetupInstructions] = useState(false);
  const [unauthorizedDomain, setUnauthorizedDomain] = useState<string | null>(null);
  const [copiedDomain, setCopiedDomain] = useState(false);

  const projectId = firebaseConfig.projectId || 'quadratic-aquifer-fwjkk';
  const consoleUrl = `https://console.firebase.google.com/project/${projectId}/authentication/providers`;
  const settingsUrl = `https://console.firebase.google.com/project/${projectId}/authentication/settings`;

  // Sync user profile to Firestore
  const syncUserProfile = async (user: any) => {
    const userDocRef = doc(db, 'users', user.uid);
    try {
      const userSnap = await getDoc(userDocRef);
      if (userSnap.exists()) {
        const existingData = userSnap.data();
        const userData = {
          uid: user.uid,
          email: user.email || '',
          displayName: user.displayName || existingData.displayName || 'Sanjeevani Patient',
          photoURL: user.photoURL || existingData.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=120',
          createdAt: existingData.createdAt // Keep original createdAt to satisfy security rules!
        };
        await setDoc(userDocRef, userData);
      } else {
        const userData = {
          uid: user.uid,
          email: user.email || '',
          displayName: user.displayName || 'Sanjeevani Patient',
          photoURL: user.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=120',
          createdAt: new Date().toISOString()
        };
        await setDoc(userDocRef, userData);
      }
    } catch (err) {
      console.error('Failed to sync user profile:', err);
      handleFirestoreError(err, OperationType.WRITE, `users/${user.uid}`);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
        setCopiedDomain(true);
        setTimeout(() => setCopiedDomain(false), 2000);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        textArea.remove();
        setCopiedDomain(true);
        setTimeout(() => setCopiedDomain(false), 2000);
      }
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const enterSandbox = (role: 'patient' | 'admin') => {
    const demoUser = role === 'admin' 
      ? {
          uid: 'demo-admin-uid-12345',
          email: 'yashicajindal1806@gmail.com', // Recognized Admin email in Sanjeevani rules
          displayName: 'Sanjeevani Admin (Sandbox Bypass)',
          isDemo: true,
          photoURL: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
        }
      : {
          uid: 'demo-patient-uid-67890',
          email: 'patient@sanjeevani.com',
          displayName: 'Guest Patient (Sandbox Bypass)',
          isDemo: true,
          photoURL: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=120'
        };
    
    localStorage.setItem('sanjeevani_demo_user', JSON.stringify(demoUser));
    window.dispatchEvent(new Event('sanjeevani_auth_changed'));
    setSuccessMsg(`Entered Local Sandbox Mode as ${role === 'admin' ? 'Administrator' : 'Patient'}!`);
    setTimeout(() => {
      onSuccess();
    }, 1000);
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setErrorMsg('');
    setUnauthorizedDomain(null);
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      if (result.user) {
        await syncUserProfile(result.user);
        setSuccessMsg('Successfully signed in with Google!');
        setTimeout(() => {
          onSuccess();
        }, 1000);
      }
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/unauthorized-domain' || (err.message && err.message.includes('unauthorized-domain'))) {
        setUnauthorizedDomain(window.location.hostname);
        setErrorMsg('Unauthorized Domain: This development/shared domain has not been added to your Firebase Authorized Domains.');
      } else {
        setErrorMsg(err.message || 'Google Sign In failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    if (!email.trim() || !password.trim()) {
      setErrorMsg('Please fill in all fields.');
      setIsLoading(false);
      return;
    }

    if (isSignUp && !displayName.trim()) {
      setErrorMsg('Please enter your full name.');
      setIsLoading(false);
      return;
    }

    try {
      if (isSignUp) {
        // Sign Up Flow
        let result;
        try {
          result = await createUserWithEmailAndPassword(auth, email, password);
        } catch (signUpErr: any) {
          if (signUpErr.code === 'auth/email-already-in-use') {
            console.log('Email already exists. Automatically attempting sign-in instead...');
            result = await signInWithEmailAndPassword(auth, email, password);
          } else {
            throw signUpErr;
          }
        }
        if (result && result.user) {
          await updateProfile(result.user, {
            displayName: displayName.trim()
          });
          // Refresh user instance to get updated display name
          const updatedUser = auth.currentUser;
          await syncUserProfile(updatedUser || result.user);
          setSuccessMsg('Account successfully created & signed in!');
          setTimeout(() => {
            onSuccess();
          }, 1000);
        }
      } else {
        // Sign In Flow
        let result;
        try {
          result = await signInWithEmailAndPassword(auth, email, password);
        } catch (signInErr: any) {
          // If the admin user doesn't exist yet in Auth, register them on the fly!
          const isInvalidCredError = 
            signInErr.code === 'auth/user-not-found' || 
            signInErr.code === 'auth/invalid-credential' || 
            signInErr.code === 'auth/invalid-login-credentials' ||
            (signInErr.message && (
              signInErr.message.includes('user-not-found') || 
              signInErr.message.includes('invalid-credential') || 
              signInErr.message.includes('invalid-login-credentials')
            ));

          if (email === 'yashicajindal1806@gmail.com' && password === '181105' && isInvalidCredError) {
            console.log('Creating Admin account on-the-fly...');
            try {
              result = await createUserWithEmailAndPassword(auth, email, password);
              if (result.user) {
                await updateProfile(result.user, {
                  displayName: 'Sanjeevani Admin'
                });
                // Reload user
                const updatedUser = auth.currentUser;
                if (updatedUser) {
                  result = { user: updatedUser };
                }
              }
            } catch (createErr: any) {
              if (createErr.code === 'auth/email-already-in-use' || (createErr.message && createErr.message.includes('email-already-in-use'))) {
                throw signInErr; // Password was incorrect for already existing admin account
              } else {
                throw createErr;
              }
            }
          } else {
            throw signInErr;
          }
        }
        if (result && result.user) {
          await syncUserProfile(result.user);
          setSuccessMsg(email === 'yashicajindal1806@gmail.com' ? 'Successfully signed in as Administrator!' : 'Successfully signed in!');
          setTimeout(() => {
            onSuccess();
          }, 1000);
        }
      }
    } catch (err: any) {
      console.error(err);
      
      const isOperationNotAllowed = 
        err.code === 'auth/operation-not-allowed' || 
        (err.message && err.message.includes('operation-not-allowed'));
        
      const isEmailAlreadyInUse = 
        err.code === 'auth/email-already-in-use' || 
        (err.message && err.message.includes('email-already-in-use'));
        
      const isWeakPassword = 
        err.code === 'auth/weak-password' || 
        (err.message && err.message.includes('weak-password'));
        
      const isInvalidCredential = 
        err.code === 'auth/invalid-credential' || 
        err.code === 'auth/user-not-found' || 
        err.code === 'auth/invalid-login-credentials' ||
        err.code === 'auth/wrong-password' ||
        (err.message && (
          err.message.includes('invalid-credential') || 
          err.message.includes('user-not-found') ||
          err.message.includes('invalid-login-credentials') ||
          err.message.includes('wrong-password')
        ));

      if (isOperationNotAllowed) {
        setErrorMsg('Email/Password Authentication is not yet enabled in your Firebase project. Please enable it in your Firebase console.');
      } else if (isEmailAlreadyInUse) {
        setErrorMsg('This email address is already in use by another account.');
      } else if (isWeakPassword) {
        setErrorMsg('The password is too weak. Please use at least 6 characters.');
      } else if (isInvalidCredential) {
        setErrorMsg('Invalid credentials. Double check your email and password, or use Local Sandbox Mode (above) to bypass configuration instantly.');
      } else {
        setErrorMsg(err.message || 'Authentication failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto my-8 p-8 bg-white border border-gray-100 rounded-3xl shadow-lg space-y-6">
      <div className="text-center space-y-2">
        <span className="text-[10px] font-bold text-teal-600 bg-teal-50 px-2.5 py-1 rounded-full uppercase tracking-wider">
          Sanjeevani Secure Access
        </span>
        <h2 className="font-display text-2xl font-extrabold text-gray-900 tracking-tight">
          {isSignUp ? 'Create Patient Account' : 'Patient Portal Sign In'}
        </h2>
        <p className="text-xs text-gray-400 font-light">
          {isSignUp 
            ? 'Sign up to manage your medical profiles and view booking history.' 
            : 'Access your consultation schedules and track verified bookings.'}
        </p>
      </div>

      {/* Recommended/Pre-configured Method - Google Login */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Recommended Method</span>
          <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-md uppercase tracking-wider">Works Instantly</span>
        </div>
        <button
          onClick={handleGoogleSignIn}
          disabled={isLoading}
          className="w-full py-3.5 border-2 border-teal-600 hover:bg-teal-50/50 text-teal-800 font-semibold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 bg-white"
        >
          <svg className="w-4.5 h-4.5 mr-1.5" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Secure Sign In with Google
        </button>
      </div>

      {/* Quick Sandbox Bypass for Instant Testing / No Configuration Blocks */}
      <div className="p-4.5 bg-sky-50 border border-sky-150 rounded-2xl text-xs space-y-3 text-sky-950 shadow-xs">
        <div className="flex items-center gap-2">
          <span className="p-1 bg-sky-100 rounded-lg text-sky-700 font-bold text-xs">🚀</span>
          <span className="font-bold text-[11px] text-sky-900 uppercase tracking-wider">Local Sandbox Mode (Instant Test)</span>
        </div>
        <p className="leading-relaxed font-light text-[11px] text-sky-800">
          Want to skip Firebase domain setup and test immediately? Sign in instantly to a secure local sandbox:
        </p>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => enterSandbox('patient')}
            className="px-3 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-bold text-[10.5px] rounded-xl transition-colors shadow-2xs uppercase tracking-wider cursor-pointer"
          >
            Bypass as Patient
          </button>
          <button
            type="button"
            onClick={() => enterSandbox('admin')}
            className="px-3 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[10.5px] rounded-xl transition-colors shadow-2xs uppercase tracking-wider cursor-pointer"
          >
            Bypass as Admin
          </button>
        </div>
      </div>

      <div className="relative my-4 text-center">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-150"></div>
        </div>
        <span className="relative bg-white px-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
          Or Use Email Account
        </span>
      </div>

      {errorMsg && (
        <div className="p-4 bg-red-50 border border-red-100 text-red-800 rounded-xl flex items-start gap-2.5 text-xs">
          <AlertCircle className="w-4.5 h-4.5 flex-shrink-0 text-red-500 mt-0.5" />
          <div className="space-y-1">
            <span className="font-semibold block">Authentication Notice</span>
            <p className="leading-relaxed font-light">{errorMsg}</p>
          </div>
        </div>
      )}

      {unauthorizedDomain && (
        <div className="p-5 bg-amber-50 border border-amber-200/60 rounded-2xl text-xs space-y-4 text-amber-900 animate-fade-in shadow-xs">
          <div className="flex items-center gap-2">
            <span className="p-1 bg-amber-100 rounded-lg text-amber-700 font-bold">⚠️</span>
            <span className="font-bold text-xs text-amber-800 uppercase tracking-wider">How to Fix Unauthorized Domain Error</span>
          </div>

          <p className="leading-relaxed font-light text-[11px]">
            Google Sign-In is blocked because your Firebase project does not authorize requests originating from this specific domain yet. Adding it to the whitelist is extremely fast:
          </p>

          <div className="space-y-2">
            <span className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider">Step 1: Copy your current domain</span>
            <div className="flex items-center gap-2 bg-white border border-amber-200/60 rounded-xl p-2.5">
              <code className="text-amber-800 font-mono text-[11px] break-all flex-grow font-semibold">
                {unauthorizedDomain}
              </code>
              <button
                type="button"
                onClick={() => copyToClipboard(unauthorizedDomain)}
                className="p-1.5 hover:bg-amber-100 rounded-lg text-amber-700 transition-colors flex-shrink-0 cursor-pointer"
                title="Copy Domain"
              >
                {copiedDomain ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <span className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider">Step 2: Add it to Firebase Settings</span>
            <ol className="list-decimal pl-4.5 space-y-1.5 text-[11px] font-light">
              <li>
                Click the button below to open your <strong>Firebase Authentication Settings</strong> page.
              </li>
              <li>
                Scroll down to the <strong>Authorized domains</strong> section.
              </li>
              <li>
                Click the <strong>Add domain</strong> button.
              </li>
              <li>
                Paste your domain <code className="bg-amber-100/60 px-1 py-0.5 rounded text-[10.5px] font-semibold font-mono">{unauthorizedDomain}</code> and click <strong>Add</strong>.
              </li>
            </ol>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row gap-2">
            <a
              href={settingsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-semibold text-[11px] rounded-xl shadow-sm transition-all uppercase tracking-wider cursor-pointer"
            >
              Go to Firebase Settings
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <button
              type="button"
              onClick={() => {
                setUnauthorizedDomain(null);
                setErrorMsg('');
              }}
              className="px-4 py-2.5 border border-amber-200 hover:bg-amber-100/40 text-amber-800 font-semibold text-[11px] rounded-xl transition-colors uppercase tracking-wider cursor-pointer"
            >
              I added it, retry!
            </button>
          </div>
        </div>
      )}

      {successMsg && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-100 text-emerald-800 rounded-xl flex items-start gap-2.5 text-xs">
          <CheckCircle className="w-4.5 h-4.5 flex-shrink-0 text-emerald-500 mt-0.5" />
          <span>{successMsg}</span>
        </div>
      )}

      <form onSubmit={handleEmailAuth} className="space-y-4">
        {isSignUp && (
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Ramesh Kumar"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full pl-9 pr-4 py-3 rounded-xl border border-gray-200 bg-white focus:outline-none focus:border-brand-500 text-sm font-sans"
                required={isSignUp}
              />
            </div>
          </div>
        )}

        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="email"
              placeholder="ramesh@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-9 pr-4 py-3 rounded-xl border border-gray-200 bg-white focus:outline-none focus:border-brand-500 text-sm font-sans"
              required
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-9 pr-4 py-3 rounded-xl border border-gray-200 bg-white focus:outline-none focus:border-brand-500 text-sm font-sans"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          {isSignUp ? (
            <>
              <UserPlus className="w-4 h-4" />
              Create Account
            </>
          ) : (
            <>
              <LogIn className="w-4 h-4" />
              Sign In
            </>
          )}
        </button>
      </form>

      <div className="text-center pt-1 flex flex-col items-center gap-2">
        <button
          onClick={() => {
            setIsSignUp(!isSignUp);
            setErrorMsg('');
            setSuccessMsg('');
          }}
          className="text-xs font-semibold text-brand-600 hover:text-brand-700 cursor-pointer"
        >
          {isSignUp 
            ? 'Already have an account? Sign In' 
            : "Don't have an account yet? Create Account"}
        </button>

        <button
          type="button"
          onClick={() => setShowSetupInstructions(!showSetupInstructions)}
          className="text-[11px] text-gray-400 hover:text-gray-600 flex items-center gap-1 mt-1 underline cursor-pointer"
        >
          <HelpCircle className="w-3.5 h-3.5" />
          How to enable Email/Password login?
          {showSetupInstructions ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        </button>
      </div>

      {/* Beautiful Developer Step-by-Step walkthrough card */}
      {showSetupInstructions && (
        <div className="p-5 bg-amber-50/70 border border-amber-200 rounded-2xl text-xs space-y-3.5 text-amber-900 animate-fade-in">
          <div className="flex items-center gap-2">
            <span className="p-1 bg-amber-100 rounded-lg text-amber-700">🛠️</span>
            <span className="font-bold text-xs text-amber-800 uppercase tracking-wider">Firebase Developer Guide</span>
          </div>
          
          <p className="leading-relaxed font-light text-[11px]">
            By default, new Firebase projects only have <strong>Google Sign-In</strong> enabled. To support traditional Email and Password accounts, you can activate the provider in your console in under a minute:
          </p>

          <ol className="list-decimal pl-4.5 space-y-2 text-[11px] font-sans">
            <li>
              Open the <strong>Firebase Auth Console</strong> using the button below.
            </li>
            <li>
              Choose your active project (<code className="bg-amber-100/80 px-1 py-0.5 rounded text-[10px] font-bold font-mono">{projectId}</code>).
            </li>
            <li>
              Under the <strong>Sign-in method</strong> tab, click the <strong>Add new provider</strong> button.
            </li>
            <li>
              Select <strong>Email/Password</strong>, switch the toggle to <strong>Enable</strong>, and click <strong>Save</strong>.
            </li>
          </ol>

          <div className="pt-2">
            <a
              href={consoleUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-amber-600 hover:bg-amber-700 text-white font-semibold text-[10px] rounded-lg shadow-sm transition-all uppercase tracking-wider"
            >
              Go to Firebase Console
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
