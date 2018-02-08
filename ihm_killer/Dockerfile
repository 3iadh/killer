FROM node:7

ENV HOME=/usr/src/app/

RUN mkdir -p $HOME

WORKDIR $HOME

COPY package.json $HOME 

RUN npm install

COPY . .

EXPOSE 4200

CMD ["npm", "start"]