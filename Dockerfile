FROM node:14.18 as frontend-ts
# Copy environment and change directories...
COPY .env .
WORKDIR /frontend-ts
# Installing packages...
COPY /frontend-ts/package.json .
RUN npm install
# Describing the environment...
ENV NODE_ENV=developement
# Preparing startup
COPY /frontend-ts .
CMD ["npm", "start"]

FROM python:3.9 as backend-py
# Copy environment and change directories...
COPY .env .
WORKDIR /backend-py
# Installing packages...
COPY /backend-py/requirements.txt .
RUN pip install -r requirements.txt
# Describing environment...
ENV FLASK_ENV=development
ENV FLASK_APP=src/server.py
ENV BACKEND_PORT=5100
# Preparing startup...
COPY /backend-py .
CMD ["python", "src/server.py"]

FROM node:14.18 as backend-ts
# Copy environment and change directories...
COPY .env .
WORKDIR /backend-ts
# Installing packages...
COPY /backend-ts/package.json .
RUN npm install
# Describing the environment...
ENV NODE_ENV=developement
ENV BACKEND_PORT=5200
# Preparing startup
COPY /backend-ts .
CMD ["npm", "start"]
