list (id SERIAL, name TEXT, position INT, created_at TIMESTAMPTZ, updated_at TIMESTAMPTZ)
card (id SERIAL, title TEXT, position INT, color TEXT, created_at TIMESTAMPTZ, updated_at TIMESTAMPTZ, #list(id) INT)
tag (id SERIAL, name TEXT, color TEXT, created_at TIMESTAMPTZ, updated_at TIMESTAMPTZ)
tag_belongsto_card (#card(id) INT, #tag(id) INT, created_at TIMESTAMPTZ, updated_at TIMESTAMPTZ)