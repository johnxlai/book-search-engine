const express = require('express');

//add apollo server
const { ApolloServer } = require('apollo-server-express');

const path = require('path');

// import our typeDefs and resolvers
const { typeDefs, resolvers } = require('./schemas');

const db = require('./config/connection');

const routes = require('./routes');

const app = express();
const PORT = process.env.PORT || 3001;

const server = new ApolloServer({
  typeDefs,
  resolvers,
});
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

// app.use(routes);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

// Create a new instance of an Apollo server with the GraphQL schema
const startApolloServer = async (typeDefs, resolvers) => {
  await server.start();
  server.applyMiddleware({ app });

  db.once('open', () => {
    app.listen(PORT, () => {
      console.log(`API server running on port ${PORT}!`);
      console.log(
        `Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`
      );
    });
  });
};

// db.once('open', () => {
//   app.listen(PORT, () => console.log(`🌍 Now listening on localhost:${PORT}`));
// });

// Call the async function to start the server
startApolloServer(typeDefs, resolvers);
