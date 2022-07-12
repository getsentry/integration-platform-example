FROM node:16.13 as backend-ts
# Installing packages...
WORKDIR /backend-ts
COPY package.json .
COPY package-lock.json .
RUN npm install
# Copy source files after installing packages
COPY . .
# Preparing startup
CMD ["npm", "start"]
