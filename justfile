# math3d-react (legacy site) — local dev tasks.
# Run `just` to list recipes.

# Directory holding the create-react-app frontend (the only thing that matters locally).
client_dir := "client"

# Dev server port. Kept outside the 300-3010 range per project convention.
port := "3141"

# Local math3d-next (DRF) backend base URL for the legacy scenes endpoints.
#   POST {base}          -> create scene
#   GET  {base}{key}     -> retrieve scene
# Requires `api.math3d.localdev` resolving to your local backend (e.g. /etc/hosts).
next_api := "http://api.math3d.localdev:8000/v1/legacy_scenes/"

# List available recipes.
default:
    @just --list

# Install client dependencies if they're missing (fast no-op when present).
install:
    #!/usr/bin/env bash
    set -euo pipefail
    if [ -d "{{client_dir}}/node_modules" ]; then
        echo "client/node_modules present — skipping install."
    else
        echo "Installing client dependencies (npm ci)…"
        cd "{{client_dir}}" && npm ci
    fi

# Start the frontend against the local math3d-next backend.
start: install
    cd "{{client_dir}}" && \
        PORT={{port}} \
        REACT_APP_NEXT_API_CREATE_URL={{next_api}} \
        REACT_APP_NEXT_API_RETRIEVE_URL={{next_api}} \
        REACT_APP_DISABLE_LEGACY_SAVE=true \
        npm start
