const express = require('express');
const expressGraphQL = require('express-graphql');
const { GraphQLSchema } = require('graphql');

const app = express();

const RootQueryType = require('./queries/RootQueryType');

const schema = new GraphQLSchema({
    query: RootQueryType,
    //mutation: RootMutationType
});

app.use('/graphql', expressGraphQL({
    schema: schema,
    graphiql: true,
}));

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server listen on port ${PORT}`);
});

