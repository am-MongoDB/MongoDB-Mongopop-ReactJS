# MongoDB-Mongopop-ReactJS
## ReactJS client for [Mongopop](https://github.com/am-MongoDB/Mongopop "Tool to add bulk data to MongoDB as well as sample it, count documents, and apply bulk changes")

17th January 2017.

**Not for production**

A React based web tool to populate a [MongoDB Atlas](https://cloud.mongo.com) (or other MongoDB) instance with sample data (fetches datasets from [Mockaroo](https://www.mockaroo.com)).

## Usage – development/debugging

Prerequisite: have Mongopop running (be default on `localhost:3000`).

Assumes that the Mongopop service is available at `http://localhost:3000/pop` – edit this in `App.j` if required.

```bash
git clone httgit@github.com:am-MongoDB/MongoDB-Mongopop-ReactJS.git
cd MongoDB-Mongopop-ReactJS
npm install
export PORT=8008 # Any port that isn't being used by Mongopop or other local server
npm start
```

## Build for 'production'

```bash
npm run build
```

And then copy the contents of the `build` directory to somewhere rootable on your 'production' web server.

Browse to `http://localhost:3000/react` (or to the IP address or hostname specified in `public/app/app.component.ts`).

## Usage (in 'production' mode)

Run [Mongopop](https://github.com/am-MongoDB/Mongopop "Tool to add bulk data to MongoDB as well as sample it, count documents, and apply bulk changes") and browse to `http://localhost:3000/react`

Test