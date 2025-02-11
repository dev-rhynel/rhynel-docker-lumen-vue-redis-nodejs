FROM node:20-alpine

WORKDIR /app

# Set ownership of app directory
RUN chown -R node:node /app

# Switch to node user
USER node

# Copy package files with correct ownership
COPY --chown=node:node package*.json ./

# Install dependencies
RUN npm install

# Copy source files with correct ownership
COPY --chown=node:node . .

EXPOSE 3000

CMD ["npm", "run", "dev", "--", "--host"]
