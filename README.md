# shadcn/ui monorepo template

This template is for creating a monorepo with shadcn/ui.

## Usage

```bash
pnpm dlx shadcn@latest init
```

## Adding components

To add components to your app, run the following command at the root of your `web` app:

```bash
pnpm dlx shadcn@latest add button -c apps/web
```

This will place the ui components in the `packages/ui/src/components` directory.

<<<<<<< Updated upstream
- **Frontend**: NextJS 15 with App Router, TypeScript, Tailwind CSS, Shadcn
- **Backend**: Node.js, Express.js, MongoDB, Mangoose, OpenAI
- **AI/NLP**: OpenAI GPT-4.1 mini, OpenAI GPT-4.1
- **Database**: MongoDB
- **Authentication**: Clerk
- **File Parsing**: pdf-parse, mammoth.js
- **Storage**: AWS S3 Bucket
  
## 🛠️ Installation
=======
## Tailwind
>>>>>>> Stashed changes

Your `tailwind.config.ts` and `globals.css` are already set up to use the components from the `ui` package.

## Using components

To use the components in your app, import them from the `ui` package.

```tsx
import { Button } from "@visume/ui/components/button";
```
