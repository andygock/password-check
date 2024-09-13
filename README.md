# Password Check

Check a password against known data breaches using Troy Hunt's [Have I Been Pwned API](https://haveibeenpwned.com/API/v3#PwnedPasswords)

Install [pnpm](https://pnpm.io/)

    npm install -g pnpm

Install dependencies

    pnpm install

Start development server

    pnpm start

Build for production into `dist/`

    pnpm build

If required, use the following Netlify build command

    pnpm build || ( npm install pnpm && pnpm build )

## Demo

This code is running at <https://andygock.github.io/password-check/>
