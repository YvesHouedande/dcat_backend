const { eq, and, or, inArray, desc, asc, sql } = require("drizzle-orm");
const { db } = require("../../../core/database/config");
const {
  produits,
  images,
  categories,
  type_produits,
  modeles,
  familles,
  marques,
} = require("../../../core/database/models");

const createProduit = async (data) => {
  const [result] = await db.insert(produits).values(data).returning();
  return result;
};

const addProduitImages = async (produitId, imageUrls) => {
  const imagesToInsert = imageUrls.map((url) => ({
    lien_image: url,
    id_produit: produitId,
  }));

  return await db.insert(images).values(imagesToInsert).returning();
};

const getProduits = async (options = {}) => {
  const {
    page = 1,
    limit = 10,
    sortBy = "created_at",
    sortOrder = "desc",
    search = "",
    categoryId,
    typeId,
  } = options;

  const offset = (page - 1) * limit;

  // Construction de la requête de base
  let query = db
    .select({
      produit: produits,
      category: categories,
      type: type_produits,
      modele: modeles,
      famille: familles,
      marque: marques,
      images: sql`(
        SELECT json_agg(json_build_object(
          'id_image', images.id_image,
          'lien_image', images.lien_image,
          'created_at', images.created_at
        )) 
        FROM images 
        WHERE images.id_produit = produits.id_produit
      )`.as("images"),
    })
    .from(produits)
    .leftJoin(categories, eq(produits.id_categorie, categories.id_categorie))
    .leftJoin(
      type_produits,
      eq(produits.id_type_produit, type_produits.id_type_produit)
    )
    .leftJoin(modeles, eq(produits.id_modele, modeles.id_modele))
    .leftJoin(familles, eq(produits.id_famille, familles.id_famille))
    .leftJoin(marques, eq(produits.id_marque, marques.id_marque))
    .limit(limit)
    .offset(offset);

  // Filtres
  if (search) {
    query = query.where(
      or(
        sql`LOWER(${produits.desi_produit}) LIKE LOWER(${"%" + search + "%"})`,
        sql`LOWER(${produits.desc_produit}) LIKE LOWER(${"%" + search + "%"})`
      )
    );
  }

  if (categoryId) {
    query = query.where(eq(produits.id_categorie, categoryId));
  }

  if (typeId) {
    query = query.where(eq(produits.id_type_produit, typeId));
  }

  // Tri
  const sortField = produits[sortBy] || produits.created_at;
  query = query.orderBy(sortOrder === "asc" ? asc(sortField) : desc(sortField));

  // Comptage total pour la pagination
  const countQuery = db.select({ count: sql`count(*)` }).from(produits);

  const [results, total] = await Promise.all([
    query,
    countQuery.then((res) => Number(res[0].count)),
  ]);

  return {
    data: results,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

const getProduitById = async (id) => {
  const [result] = await db
    .select({
      produit: produits,
      images: sql`(
        SELECT json_agg(json_build_object(
          'id_image', images.id_image,
          'lien_image', images.lien_image,
          'created_at', images.created_at
        )) 
        FROM images 
        WHERE images.id_produit = produits.id_produit
      )`.as("images"),
      category: categories,
      type: type_produits,
      modele: modeles,
      famille: familles,
      marque: marques,
    })
    .from(produits)
    .leftJoin(categories, eq(produits.id_categorie, categories.id_categorie))
    .leftJoin(
      type_produits,
      eq(produits.id_type_produit, type_produits.id_type_produit)
    )
    .leftJoin(modeles, eq(produits.id_modele, modeles.id_modele))
    .leftJoin(familles, eq(produits.id_famille, familles.id_famille))
    .leftJoin(marques, eq(produits.id_marque, marques.id_marque))
    .where(eq(produits.id_produit, id));

  return result;
};

const getProduitsByTypes = async (idType, { limit = 50, offset = 0 } = {}) => {
  const produitsList = await db
    .select()
    .from(produits)
    .where(eq(produits.id_type_produit, idType))
    .limit(limit)
    .offset(offset);

  if (!produitsList.length) return [];

  const ids = produitsList.map((p) => p.id_produit);

  const imagesList = await db
    .select()
    .from(images)
    .where(inArray(images.id_produit, ids));

  return produitsList.map((produit) => ({
    ...produit,
    images: imagesList.filter((img) => img.id_produit === produit.id_produit),
  }));
};

const updateProduit = async (id, data) => {
  const [result] = await db
    .update(produits)
    .set({
      ...data,
      updated_at: new Date(),
    })
    .where(eq(produits.id_produit, id))
    .returning();
  return result;
};

const deleteProduit = async (id) => {
  // Supprimer d'abord les images associées
  await db.delete(images).where(eq(images.id_produit, id));

  // Puis supprimer le produit
  const [result] = await db
    .delete(produits)
    .where(eq(produits.id_produit, id))
    .returning();
  return result;
};

const deleteProduitImage = async (imageId) => {
  const [result] = await db
    .delete(images)
    .where(eq(images.id_image, imageId))
    .returning();
  return result;
};

module.exports = {
  createProduit,
  addProduitImages,
  getProduits,
  getProduitById,
  updateProduit,
  deleteProduit,
  deleteProduitImage,
  getProduitsByTypes,
};
