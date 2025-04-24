INSERT INTO public.employes(
    id, nom, keycloak_id, prenom, email, contact, adresse, status, fonction_id)
VALUES 
    (1, 'Dupont', 'keycloak-001', 'Jean', 'jean.dupont@example.com', '0612345678', '10 Rue de Paris, 75001', true, 1),x
    (2, 'Martin', 'keycloak-002', 'Sophie', 'sophie.martin@example.com', '0623456789', '22 Av. des Champs, 69002', true, 2),
    (3, 'Bernard', 'keycloak-003', 'Pierre', 'pierre.bernard@example.com', '0634567890', '5 Bd Liberté, 13003', true, 3), -- Technicien
    (4, 'Petit', 'keycloak-004', 'Marie', 'marie.petit@example.com', '0645678901', '15 Rue Lyon, 31004', false, 3), -- Technicien
    (5, 'Durand', 'keycloak-005', 'Luc', 'luc.durand@example.com', '0656789012', '30 Av. Central, 59005', true, 4),
    (6, 'Leroy', 'keycloak-006', 'Emma', 'emma.leroy@example.com', '0667890123', '8 Pl. République, 67006', true, 5),
    (7, 'Moreau', 'keycloak-007', 'Thomas', 'thomas.moreau@example.com', '0678901234', '12 Rue Principale, 33007', true, 3), -- Technicien
    (8, 'Lefebvre', 'keycloak-008', 'Julie', 'julie.lefebvre@example.com', '0689012345', '40 Bd des Roses, 06008', false, 2),
    (9, 'Roux', 'keycloak-009', 'Nicolas', 'nicolas.roux@example.com', '0690123456', '25 Impasse Fleurie, 34009', true, 3), -- Technicien
    (10, 'Girard', 'keycloak-010', 'Isabelle', 'isabelle.girard@example.com', '0601234567', '18 Chemin Vert, 44010', true, 1);