FROM node:16.13 as backend-ts
# Installing packages...
WORKDIR /backend-ts
COPY . .
RUN npm install
# Preparing startup
CMD ["npm", "start"]
