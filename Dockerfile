FROM node:16-alpine3.12

# use node docker image where node is of version 16 and has apline linux OS

# node:lts-apline3.12 - always use latest nodejs with alpine linux OS

#  working directory for any subsequent ADD, COPY, CMD, ENTRYPOINT, or RUN instructions that follow it in the Dockerfile.
WORKDIR /app

# Copy files or folders from source to the dest path in the image's filesystem
# COPY source destination
# source - nasa-project folder
# dest - app folder we created 
# COPY . .
# RUN npm install --only=production

COPY package*.json ./

COPY client/package*.json client/
RUN npm run install-client --omit=dev


COPY server/package*.json server/
RUN npm run install-server --omit=dev


COPY client/ client/
RUN npm run build --prefix client


COPY server/ server/  


# replacing the default 'root' with user 'node'
USER node 

CMD [ "npm" , "start", "--prefix", "server" ]

# exposing the port which should be available outside of the docker container
EXPOSE 8000

# docker build . -t nisarg221b/nasa-project
# docker run -it -p 8000:8000 nisarg221b/nasa-project