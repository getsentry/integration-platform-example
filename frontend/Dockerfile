FROM node:16.13 as frontend
# Installing packages...
WORKDIR /frontend
COPY . .
RUN npm install
# Describing the environment...
ENV NODE_ENV=developement
# Preparing startup
CMD ["npm", "start"]
