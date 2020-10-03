WITH update_access AS (
    UPDATE graphs SET
        times_accessed = times_accessed + 1,
        last_accessed = now()
        WHERE url_key = ${ urlKey }
)
SELECT dehydrated FROM graphs WHERE url_key = ${ urlKey };