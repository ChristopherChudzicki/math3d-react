INSERT INTO graphs (
  url_key,
  dehydrated
)
VALUES (${ urlKey }, ${dehydrated})
ON CONFLICT (url_key) DO UPDATE SET dehydrated = ${dehydrated};