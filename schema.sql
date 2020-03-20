DROP TABLE IF EXISTS locations;

CREATE TABLE locations (
  search_query VARCHAR(255),
  formatted_query VARCHAR(255),
  latitude  VARCHAR(255),
  longitude  VARCHAR(255)
);

INSERT INTO locations (search_query, formatted_query, latitude,longitude)
VALUES ('monterrey', 'monterrey', '25.6802019', '-100.3152586');

-- SELECT * FROM locations;