FROM php:5-fpm-alpine

RUN apk add --update curl-dev \
    && docker-php-ext-install curl \
    && rm -rf /var/cache/apk/*

WORKDIR /var/www/avatar-ui

ADD . /var/www/avatar-ui
