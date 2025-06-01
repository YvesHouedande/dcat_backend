const jwt = require('jsonwebtoken');
const admin = require('firebase-admin');

// Initialisation Firebase
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
      clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY.replace(/\\n/g, '\n')
    })
  });
}

exports.verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ 
      code: 'MISSING_AUTH_HEADER',
      message: 'Authorization header required (Bearer token)' 
    });
  }

  const token = authHeader.split(' ')[1];

  // Essayer d'abord avec JWT local
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = {
      id_client: decoded.id,
      email: decoded.email,
      role: decoded.role || 'client',
      authType: 'local'
    };
    return next();
  } catch (jwtError) {
    // Si échec, essayer avec Firebase
    try {
      const decoded = await admin.auth().verifyIdToken(token);
      
      // Chercher l'utilisateur dans la base de données
      const [user] = await db.select()
        .from(clients_en_ligne)
        .where(eq(clients_en_ligne.email, decoded.email));

      if (!user) {
        return res.status(403).json({
          code: 'USER_NOT_FOUND',
          message: 'Firebase user not registered in system'
        });
      }

      req.user = {
        id_client: user.id_client,
        email: user.email,
        role: user.role,
        authType: 'firebase'
      };
      return next();
    } catch (firebaseError) {
      console.error('Token verification failed:', { jwtError, firebaseError });
      return res.status(403).json({ 
        code: 'INVALID_TOKEN',
        message: 'Failed to authenticate token' 
      });
    }
  }
};