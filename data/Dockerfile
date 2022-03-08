FROM postgres:14.2 as database

# Install node to enable seeding...
RUN apt-get update
RUN apt-get install -y curl
RUN curl -sL https://deb.nodesource.com/setup_16.x | bash
RUN apt-get install -y nodejs

# Installing packages...
WORKDIR /data
COPY . .
RUN npm install
