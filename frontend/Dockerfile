FROM node:16.13 as frontend
# Installing packages...
WORKDIR /frontend
COPY package.json .
COPY package-lock.json .
RUN npm install
# Copy source files after installing packages
COPY . .
# Describing the environment...
ENV NODE_ENV=developement
# Preparing startup
CMD ["npm", "start"]
