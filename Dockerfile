FROM node:22-alpine

WORKDIR /app

COPY . /app

RUN npm install -g @angular/cli

RUN npm install

EXPOSE 4200:4200

CMD ["npm", "start", "--", "--host=0.0.0.0"]