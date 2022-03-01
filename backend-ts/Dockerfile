FROM node:16.13 as backend-ts
# Copy environment and change directories...
COPY ../.env .
WORKDIR /backend-ts
# Installing packages...
COPY . .
RUN npm install
# Describing the environment...
ENV NODE_ENV=developement
ENV BACKEND_PORT=5200
# Preparing startup
CMD ["npm", "start"]
