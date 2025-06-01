const admin = require('firebase-admin');

// Configuration sécurisée avec vérification
const firebasePrivateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n');

if (!firebasePrivateKey) {
  throw new Error('Configuration Firebase Admin manquante dans .env');
}

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
      clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
      privateKey: firebasePrivateKey
    })
  });
}

exports.verifyFirebaseToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ 
      code: 'MISSING_AUTH_HEADER',
      message: 'Authorization header required (Bearer token)' 
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    
    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      // Ajoutez d'autres champs nécessaires
      nom: decodedToken.name || decodedToken.email.split('@')[0],
      isEmailVerified: decodedToken.email_verified || false
    };

    next();
  } catch (error) {
    console.error('[FIREBASE AUTH ERROR]', error);
    
    const errorMap = {
      'auth/id-token-expired': 401,
      'auth/argument-error': 400,
      'auth/invalid-id-token': 403
    };

    res.status(errorMap[error.code] || 401).json({
      code: error.code || 'AUTH_ERROR',
      message: error.message || 'Authentication failed'
    });
  }
};