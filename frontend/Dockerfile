FROM node:latest

# Create app directory
RUN mkdir -p /src/app
WORKDIR /src/app

COPY package.json /src/app/

RUN npm install
CMD ["npm", "start"]
