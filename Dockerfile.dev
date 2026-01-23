# Using node:slim as base
FROM node:slim

# Install pnpm globally
RUN npm install -g pnpm

WORKDIR /app

# Copy pnpm-lock.yaml and package.json
# Using the lockfile ensures your build is deterministic
# 3. Copy files and set ownership to 'node' user
COPY --chown=node:node pnpm-lock.yaml package.json ./


# Install dependencies using pnpm
# --frozen-lockfile is the equivalent of 'npm ci' (prevents updating the lockfile)
# 4. Install dependencies
RUN pnpm install --frozen-lockfile

# 5. Copy the rest of the code as 'node' user
COPY --chown=node:node . .

# 6. Switch to the non-root user for security
USER node

EXPOSE 8000

CMD [ "node", "src/index.js" ]
