DROP TABLE IF EXISTS locations;

CREATE TABLE locations (
  search_query VARCHAR(255),
  formatted_query TEXT,
  latitude  VARCHAR(255),
  longitude  VARCHAR(255)
)
