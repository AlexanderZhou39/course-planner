FROM node:18

WORKDIR /app

# install pm2
RUN npm install -g pm2
# make directories
RUN mkdir frontend && mkdir backend

# setup backend
COPY ./backend/package.json ./backend/
COPY ./backend/yarn.lock ./backend/
RUN cd ./backend && yarn install
COPY ./backend/ ./backend/

# setup frontend
COPY ./frontend/package.json ./frontend/
COPY ./frontend/yarn.lock ./frontend/
RUN cd ./frontend && yarn install
COPY ./frontend/ ./frontend/

# build app
RUN cd ./frontend && yarn build
RUN mv ./frontend/dist ./backend/

# expost port and run backend
ENV PORT=3000
EXPOSE 3000
WORKDIR /app/backend
CMD [ "pm2-runtime", "start", "app.js" ]
