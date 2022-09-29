# Gustavo Cabezal Portfolio Site

Portfolio website for Gustavo Cabezal.

## Languages, Libraries & Frameworks

-   Astro
-   Tailwindcss
-   Firebase Hosting
-   Firestore
-   Cloud Functions

## Installation

Install Portfolio with npm and Astro

```bash
  git clone https://github.com/meisterveda/portfolio.git
  cd portfolio
  yarn install --frozen-lockfile
  yarn run build
```

## How to deploy

1. Make sure you have [firebase-tools](https://www.npmjs.com/package/firebase-tools) installed.

2. Create `firebase.json` and `.firebaserc` at the root of your project with the following content:

    `firebase.json`:

    ```json
    {
        "hosting": {
            "public": "dist",
            "ignore": []
        }
    }
    ```

    `.firebaserc`:

    ```json
    {
        "projects": {
            "default": "<YOUR_FIREBASE_ID>"
        }
    }
    ```

3. After running `npm run build`, deploy using the command `firebase deploy`.

## Screenshots

![App Screenshot](https://raw.githubusercontent.com/meisterveda/portfolio/main/src/assets/images/portfolio.png)

## Credits

For the Astro Theme I used [Astrowind](https://astrowind.vercel.app/) by [onWidget](https://onwidget.com/)
