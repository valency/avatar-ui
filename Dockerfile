FROM nginx:stable-alpine

WORKDIR /var/www/avatar-ui

ADD . /var/www/avatar-ui
