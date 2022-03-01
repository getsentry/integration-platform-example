FROM node:16.13 as frontend-ts
# Change directories...
WORKDIR /frontend-ts
# Installing packages...
COPY . .
RUN npm install
# Describing the environment...
ENV NODE_ENV=developement
# Preparing startup
CMD ["npm", "start"]
