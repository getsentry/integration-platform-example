FROM node:16.13 as frontend-ts
# Copy environment and change directories...
COPY .env .
WORKDIR /frontend-ts
# Installing packages...
COPY /frontend-ts .
RUN npm install
# Describing the environment...
ENV NODE_ENV=developement
# Preparing startup
CMD ["npm", "start"]

FROM python:3.9 as backend-py
# Copy environment and change directories...
COPY .env .
WORKDIR /backend-py
# Installing packages...
COPY /backend-py .
RUN pip install -r requirements.txt
# Describing environment...
ENV FLASK_ENV=development
ENV FLASK_APP=src/server.py
ENV BACKEND_PORT=5100
# Preparing startup...
CMD ["python", "src/server.py"]

FROM node:16.13 as backend-ts
# Copy environment and change directories...
COPY .env .
WORKDIR /backend-ts
# Installing packages...
COPY /backend-ts .
RUN npm install
# Describing the environment...
ENV NODE_ENV=developement
ENV BACKEND_PORT=5200
# Preparing startup
CMD ["npm", "start"]
