FROM node:16.13 as frontend-ts
# Installing packages...
WORKDIR /frontend-ts
COPY . .
RUN npm install
# Describing the environment...
ENV NODE_ENV=developement
# Preparing startup
CMD ["npm", "start"]
