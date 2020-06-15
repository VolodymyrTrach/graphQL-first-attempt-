const express = require('express')
const app = express()
const expressGraphql = require('express-graphql')
const {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLString
} = require('graphql')

const mySchema = new GraphQLSchema({
    query: new GraphQLObjectType({
        name: 'Helloworld',
        fields: () => ({
            message: {
                type: GraphQLString,
                resolve: () => 'Hello World !!!'
            }
        })
    })
})
app.use('/graphql', expressGraphql({
    schema: mySchema,
    graphiql: true,
}))
app.listen(5000, () => {
    console.log('Server listening on port 5000!');
});
