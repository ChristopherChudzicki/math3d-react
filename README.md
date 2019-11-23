# Math3d-React [![Build Status](https://travis-ci.com/ChristopherChudzicki/math3d-react.svg?branch=master)](https://travis-ci.com/ChristopherChudzicki/math3d-react)

Live at [math3d.org](https://www.math3d.org)

## Package Anatomy

This repository has three `package.json` files:

- `math3d-react/server/package.json` server dependencies and scripts
- `math3d-react/client/package.json` client dependencies and scripts
- `math3d-react/package.json` deployment & development scripts


## To Install for Local Development:

1. **Install Mongodb:** If it is not already installed, you'll need to install `mongodb` as our database. On a Mac, we recommend installing `mongodb` with Homebrew:

        ```bash
        > brew tap mongodb/brew
        > brew install mongodb-community
        ```
    (Works with `mongodb` v4.2.1; probably others, too.)

1. **Install Dependencies:** Clone the git repo and `cd` to package root, then run:

        ```bash
        > npm install
        ```
    which installs both client and server dependencies.

1. **Set Database Connection:** Create a `.env` file in the `server/` directory to set `MONGO_URI` database connection environment variable. For local development, just copy the template:
        ```bash
        > cp server/dotenv_template server/.env
        ```

1. **Start the Database:**:
        ```bash
        > npm run start-db
        ```

1. **Start Server & Client:** In a new terminal window, start the server:
        ```bash
        > npm start:dev:server
        ```
    and, in a third terminal window, start the client app:
        ```bash
        > npm start:dev:client
        ```

The math3d-react app is now being served on `http://localhost:3000/`.
