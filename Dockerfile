FROM node:18

WORKDIR /app

# ==============================
# Nginx
# ==============================

# install
RUN apt-get update && \
    apt-get -y install nano && \
    apt-get -y install nginx && \
    apt-get -y install certbot && \
    apt-get -y install python3-certbot-nginx

COPY ./nginx_proxy.conf /etc/nginx/sites-available/plancourses.lol.conf
RUN ln -s /etc/nginx/sites-available/plancourses.lol.conf /etc/nginx/sites-enabled/plancourses.lol.conf

RUN sed -i "s|# server_names_hash_bucket_size 64;|server_names_hash_bucket_size 64;|g" \
    /etc/nginx/nginx.conf

RUN service nginx start

# ==============================
# App
# ==============================

# install pm2
RUN npm install -g pm2
# make directories
RUN mkdir frontend && mkdir backend
# copy frontend package locks
COPY ./frontend/package.json ./frontend/
COPY ./frontend/yarn.lock ./frontend/
# copy backend package locks
COPY ./backend/package.json ./backend/
COPY ./backend/yarn.lock ./backend/
# install dependencies
RUN cd ./frontend && yarn install
RUN cd ./backend && yarn install
# copy files
COPY ./frontend/ ./frontend/
COPY ./backend/ ./backend/
# build app
RUN cd ./frontend && yarn build
RUN mv ./frontend/dist ./backend/
# expost port and run backend
ENV PORT=3000
EXPOSE 80
WORKDIR /app/backend
CMD [ "pm2-runtime", "start", "app.js" ]
