# friendsManagement

Simple friends management api

# Getting started

Make sure you have `Docker` installed. Run project

```
$ git clone https://github.com/zuomoumou666/friendsManagement.git
$ cd friendsManagement
$ docker-compose up #via docker
```

## Port Mappings

| Services / DB            | Host Port |
| ------------------------ | --------- |
| friends-management       | 8999      |
| friends-management-mongo | 8998      |
| friends-doc              | 5400      |
| remote debug             | 9228      |

## Project Structure

| Name              | Description                                                                                  |
| ----------------- | -------------------------------------------------------------------------------------------- |
| **.vscode**       | Contains VS Code specific settings                                                           |
| **dist**          | Contains the distributable (or output) from your TypeScript build. This is the code you ship |
| **node_modules**  | Contains all your npm dependencies                                                           |
| **src**           | Contains your source code that will be compiled to the dist dir                              |
| **src**/server.ts | Entry point to your app                                                                      |
| **swagger**       | Contains swagger api specification                                                           |
| **src/test**      | Contains your tests. Seperate from source because there is a different build process.        |
| .env              | API keys, tokens, passwords, database URI. Clone this!                                       |
| package.json      | File that contains npm dependencies as well as build scripts                                 |
| tsconfig.json     | Config settings for compiling server code written in TypeScript                              |
| tslint.json       | Config settings for TSLint code style checking                                               |

## Server

Use `Koa` to build a simple API server. basic on `Typescript`.

## API

You can open http://127.0.0.1:5400 to try the API. Build by `Swagger`.

## DB

Use `mongoose` to connect the `MongoDB`.

## Test

Test with `Mocha`. You can open a new terminal to run

```
$ yarn install
$ npm run test:api
```

It will generate reports in `src/mochawesoome-report`

## Code Style

Use `tslint` to inspect code style
