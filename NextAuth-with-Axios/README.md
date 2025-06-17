This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

### Development in local environment:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

### Develop with Docker

```bash
# Create a network, which allows containers to communicate
# with each other, by using their container name as a hostname
docker network create development

# Build dev
docker compose -f compose.dev.yaml build

# Up dev
docker compose -f compose.dev.yaml up
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.
