const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { db } = require('../../../core/database/config');
const { clients_en_ligne } = require('../../../core/database/models');
const { eq } = require('drizzle-orm');

// Helpers
const generateJWT = (user) => {
  return jwt.sign(
    {
      id: user.id_client,
      email: user.email,
      role: user.role
    },
    process.env.JWT_SECRET,
    { expiresIn: '30d' }
  );
};

const formatUserResponse = (user) => {
  return {
    id_client: user.id_client,
    email: user.email,
    nom: user.nom,
    contact: user.contact,
    role: user.role
  };
};


exports.firebaseAuth = async (req, res) => {
  try {
    const { token } = req.body;
    
    // Vérifier le token Firebase
    const decoded = await admin.auth().verifyIdToken(token);
    
    // Chercher ou créer l'utilisateur
    const [user] = await db.select()
      .from(clients_en_ligne)
      .where(eq(clients_en_ligne.email, decoded.email));

    if (!user) {
      // Créer un nouvel utilisateur si non trouvé
      const [newUser] = await db.insert(clients_en_ligne)
        .values({
          email: decoded.email,
          nom: decoded.name || decoded.email.split('@')[0],
          contact: decoded.phone_number || '',
          password: null,
          role: 'client',
          source: 'firebase',
          firebase_uid: decoded.uid
        })
        .returning();

      return res.json({
        success: true,
        token: generateJWT(newUser),
        user: formatUserResponse(newUser)
      });
    }

    // Utilisateur existant
    res.json({
      success: true,
      token: generateJWT(user),
      user: formatUserResponse(user)
    });

  } catch (error) {
    console.error('Firebase auth error:', error);
    res.status(401).json({
      success: false,
      message: 'Firebase authentication failed'
    });
  }
};
// Firebase Sync
exports.syncUser = async (req, res) => {
  try {
    // const { uid, email, nom, contact, provider } = req.body;
    const { email, nom, contact, provider } = req.body;
    

    const [user] = await db.select()
      .from(clients_en_ligne)
      .where(eq(clients_en_ligne.email, email));

    if (user) {
      return res.json({
        success: true,
        token: generateJWT(user),
        user: formatUserResponse(user)
      });
    }

    const [newUser] = await db.insert(clients_en_ligne)
      .values({
        email,
        nom: nom || email.split('@')[0],
        contact,
        password: null,
        role: 'client',
        source: provider
      })
      .returning();

    res.json({
      success: true,
      token: generateJWT(newUser),
      user: formatUserResponse(newUser)
    });

  } catch (error) {
    console.error('Sync error:', error);
    res.status(500).json({
      success: false,
      message: 'Error syncing user'
    });
  }
};

// Local Registration
exports.register = async (req, res) => {
  try {
    const { email, password, nom, contact } = req.body;

    const [existing] = await db.select()
      .from(clients_en_ligne)
      .where(eq(clients_en_ligne.email, email));

    if (existing) {
      return res.status(400).json({ 
        success: false,
        message: 'Email already exists' 
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    
    const [user] = await db.insert(clients_en_ligne)
      .values({
        email,
        nom,
        contact,
        password: hashedPassword,
        role: 'client',
        source: 'local'
      })
      .returning();

    res.status(201).json({
      success: true,
      token: generateJWT(user),
      user: formatUserResponse(user)
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Registration failed'
    });
  }
};

// Local Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const [user] = await db.select()
      .from(clients_en_ligne)
      .where(eq(clients_en_ligne.email, email));

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    res.json({
      success: true,
      token: generateJWT(user),
      user: formatUserResponse(user)
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Login failed'
    });
  }
};


// Récupérer l'utilisateur connecté
exports.getCurrentUser = async (req, res) => {
  try {
    const [user] = await db.select()
      .from(clients_en_ligne)
      .where(eq(clients_en_ligne.id_client, req.user.id_client));

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }

    res.json({
      success: true,
      user: formatUserResponse(user)
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
};

// Mettre à jour le profil
exports.updateProfile = async (req, res) => {
  try {
    const { nom, contact } = req.body;

    const [updatedUser] = await db.update(clients_en_ligne)
      .set({
        nom,
        contact,
        updated_at: new Date()
      })
      .where(eq(clients_en_ligne.id_client, req.user.id_client))
      .returning();

    res.json({
      success: true,
      user: formatUserResponse(updatedUser)
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour'
    });
  }
};