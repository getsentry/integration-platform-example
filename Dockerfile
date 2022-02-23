FROM python:3.9 as backend-py
WORKDIR /backend-py
# Installing packages...
COPY /backend-py/requirements.txt .
RUN pip install -r requirements.txt
# Describing environment...
ENV FLASK_ENV=development
ENV FLASK_APP=server.py
# Preparing startup...
EXPOSE 2809
COPY /backend-py/server.py .
CMD ["python", "server.py"]


FROM node:14.18 as backend-ts
WORKDIR /backend-ts
# Installing packages...
COPY /backend-ts/package.json .
RUN npm install
# Describing the environment...
ENV NODE_ENV=developement
# Preparing startup
EXPOSE 2809
COPY /backend-ts/. .
CMD ["npm", "start"]

FROM node:14.18 as frontend-ts
WORKDIR /frontend-ts
# Installing packages...
COPY /frontend-ts/package.json .
RUN npm install
# Describing the environment...
ENV NODE_ENV=developement
# Preparing startup
EXPOSE 2909
COPY /frontend-ts/. .
CMD ["npm", "start"]
