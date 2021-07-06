BEGIN;

DROP TABLE IF EXISTS "list", "card", "tag", "tag_belongsto_card" ;

-- table list
CREATE TABLE IF NOT EXISTS "list" (
    "id" SERIAL PRIMARY KEY,
    --  INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY
    "name" TEXT NOT NULL DEFAULT '',
    "position" INT NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

--  table card
CREATE TABLE IF NOT EXISTS "card" (
    "id" SERIAL PRIMARY KEY,
    "title" TEXT NOT NULL DEFAULT '',
    "position" INT NOT NULL DEFAULT 0,
    "color" TEXT NOT NULL DEFAULT '#FFF',
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "list_id" INTEGER NOT NULL REFERENCES "list"("id") ON DELETE CASCADE
    -- le ON DELETE CASCADE permet dans le cas de la suppression d'une liste ayant des cartes de supprimer également les cartes qui lui sont associées
);

-- table tag
CREATE TABLE IF NOT EXISTS "tag" (
    "id" SERIAL PRIMARY KEY,
    "name" TEXT NOT NULL DEFAULT '' UNIQUE,
    "color" TEXT NOT NULL DEFAULT '#FFF',
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- table de liaison tag_belongsto_card
CREATE TABLE IF NOT EXISTS "tag_belongsto_card" (
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "card_id" INTEGER NOT NULL REFERENCES "card"("id") ON DELETE CASCADE,
    "tag_id" INTEGER NOT NULL REFERENCES "tag"("id") ON DELETE CASCADE,
    PRIMARY KEY ("card_id", "tag_id")
);


INSERT INTO "list" ("name", "position") VALUES 
('à manger', 1),
('ménage à faire', 2),
('langues à apprendre', 3);


INSERT INTO "card" ("title", "color", "list_id") VALUES
('brocolis', '#00A91F', 1),
('schokobons', '#FFF700', 1),
('salle de bain', '#FF8F00', 2),
('allemand', '#0055FF', 3),
('spaghetti', '#FFF700', 1),
('chambre', '#FF0000', 2),
('esperanto', '#FF8F00', 3),
('klingon', '#0055FF', 3);


INSERT INTO "tag" ("name", "color") VALUES
('urgent', '#0055FF'),
('loisirs', '#00A91F'),
('bon pour la santé', '#F0F'),
('à manger sans modération', '#FFF'),
('pas prioritaire', '#000');


INSERT INTO "tag_belongsto_card" ("card_id", "tag_id") VALUES
(1, 3),
(2, 4),
(3, 5),
(4, 2),
(5, 4),
(6, 1),
(7, 5),
(8, 2);


COMMIT;