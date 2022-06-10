FROM oraclelinux:7-slim as builder

ARG release=19
ARG update=5

RUN yum -y install oracle-release-el7 &&
     oracle-instantclient${release}.${update}-basiclite

RUN rm -rf /usr/lib/oracle/${release}.${update}/client64/bin
WORKDIR /usr/lib/oracle/${release}.${update}/client64/lib/
RUN rm -rf *jdbc* *occi* *mysql* *jar

# Get a new image
FROM node:16

# Copy the Instant Client libraries, licenses and config file from the previous image
COPY --from=builder /usr/lib/oracle /usr/lib/oracle
COPY --from=builder /usr/share/oracle /usr/share/oracle
COPY --from=builder /etc/ld.so.conf.d/oracle-instantclient.conf /etc/ld.so.conf.d/oracle-instantclient.conf

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . .

EXPOSE 8080
CMD [ "node", "app.js" ]