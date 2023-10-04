FROM harbor.dev.socialsys.ru/public/nginx:stable-alpine3.17-slim

ADD ./ /www/code

ADD ./nginx.conf /etc/nginx/conf.d/default.conf

RUN sed -i "s/http {/http {\n        client_max_body_size 10M;/" /etc/nginx/nginx.conf
