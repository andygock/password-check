# Password Check

⚠️ This is no longer maintained. Superceded by [password-check v2](https://github.com/andygock/password-check-v2).

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
