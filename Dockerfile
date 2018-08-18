FROM node:8.11-slim
LABEL maintainer="zuomoumou666@gmail.com"

WORKDIR /friends-api
ADD . /friends-api
RUN yarn install

#EXPOSE 3000

#CMD ["npm", "run", "debug"]
