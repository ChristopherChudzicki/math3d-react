# Math3d-React [![Build Status](https://travis-ci.com/ChristopherChudzicki/math3d-react.svg?branch=master)](https://travis-ci.com/ChristopherChudzicki/math3d-react)

Live at [math3d.org](https://www.math3d.org)

## Package Anatomy

This repository has three `package.json` files:

- `math3d-react/server/package.json` server dependencies and scripts
- `math3d-react/client/package.json` client dependencies and scripts
- `math3d-react/package.json` deployment & development scripts


## To Install for Local Development:

1. **Install Postgresql:** If it is not already installed, you'll need to install `postgres` as our database. On a Mac, we recommend installing `postgres` with Homebrew:

        ```bash
        brew update
        brew install postgresql
        ```

1. **Bootstrapping the database:** Create a database cluster and start Postgres 

        ```bash
        # creates a new database cluster
        initdb /usr/local/var/postgres
        # starts postgres
        pg_ctl -D /usr/local/var/postgres start
        # create user math3d_user and database math3d
        psql -d postgres -f server/migrations/create_database.sql
        # create schema
        psql -U math3d_user -d math3d -f server/migrations/database_setup.sql
        ```

1. **Set Database Connection:** Create a `.env` file in the `server/` directory to set `DATABASE_URL` database connection environment variable. For local development, just copy the template:
        ```bash
        > cp server/dotenv_template server/.env
        ```

1. **Install Dependencies:** Clone the git repo and `cd` to package root, then run:

        ```bash
        > npm install
        ```
    which installs both client and server dependencies.


1. **Start Server & Client:** In a new terminal window, start the server:
        ```bash
        > npm start:dev:server
        ```
    and, in a third terminal window, start the client app:
        ```bash
        > npm start:dev:client
        ```

The math3d-react app is now being served on `http://localhost:3000/`.
