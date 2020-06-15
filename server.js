const express = require('express')
const app = express()
const expressGraphql = require('express-graphql')
const {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLString,
    GraphQLList,
    GraphQLInt,
    GraphQLNonNull
} = require('graphql')

const authors = [
    { id: 1, name: 'Stiven king' },
    { id: 2, name: 'Philip José Farmer' },
    { id: 3, name: 'Charles Dickens' }
]

const books = [
    { id: 1, name: ' Riders of the Purple Wage', authorId: 2 },
    { id: 2, name: 'World of Tiers', authorId: 2 },
    { id: 3, name: 'River World', authorId: 2 },
    { id: 4, name: 'The Signal-Man', authorId: 3 },
    { id: 5, name: 'A Tale of Two Cities', authorId: 3 },
    { id: 6, name: 'Great Expectations', authorId: 3 },
    { id: 7, name: 'The Signal-Man', authorId: 3 },
    { id: 8, name: 'IT', authorId: 1 },
    { id: 9, name: 'Green mile', authorId: 1 }
]

const BookType = new GraphQLObjectType({
    name: 'Book',
    description: 'books that are written by the author',
    fields: () => ({
        id: { type: GraphQLNonNull(GraphQLInt) },
        name: { type: GraphQLNonNull(GraphQLString) },
        authorId: { type: GraphQLNonNull(GraphQLInt) },
        author: {
            type: AuthorType,
            resolve: (book) => {
                return authors.find(author => author.id === book.authorId)
            }
        }
    })
})
const AuthorType = new GraphQLObjectType({
    name: 'Author',
    description: 'The authors',
    fields: () => ({
        id: { type: GraphQLNonNull(GraphQLInt) },
        name: { type: GraphQLNonNull(GraphQLString) },
        books: {
            type: new GraphQLList(BookType),
            resolve: (author) => {
                return books.filter(book => author.id === book.authorId)
            }
        }
    })
})

const RootQueryType = new GraphQLObjectType({
    name: 'query',
    description: 'Root query',
    fields: () => ({
        book: {
            type: BookType,
            description: 'One book',
            args: {
                id: { type: GraphQLInt }
            },
            resolve: (parent, args) => books.find(book => book.id === args.id)
        },
        books: {
            type: new GraphQLList(BookType),
            description: 'list of books',
            resolve: () => books
        },
        author: {
            type: AuthorType,
            description: 'One author',
            args: {
                id: { type: GraphQLInt }
            },
            resolve: (parent, args) => authors.find(author => author.id === args.id)
        },
        authors: {
            type: new GraphQLList(AuthorType),
            description: 'All authors',
            resolve: () => authors
        }
    })
})

const RootMutationType = new GraphQLObjectType({
    name: 'mutation',
    description: 'Root for mutation',
    fields: () => ({
        addbook: {
            type: BookType,
            description: 'add one book',
            args: {
                authorId: { type: GraphQLNonNull(GraphQLInt) },
                name: { type: GraphQLNonNull(GraphQLString) },
            },
            resolve: (parent, args) => {
                const book = {
                    id : books.length + 1,
                    authorId : args.authorId,
                    name : args.name
                }
                books.push(book)
                return book
            }
        },
        addauthor: {
            type: AuthorType,
            description: 'add one author',
            args: {
                name: { type: GraphQLNonNull(GraphQLString) },
            },
            resolve: (parent, args) => {
                const author = {
                    id : authors.length + 1,
                    name : args.name
                }
                authors.push(author)
                return author
            }
        },
    })
})


const schema = new GraphQLSchema({
    query: RootQueryType,
    mutation: RootMutationType
})
app.use('/graphql', expressGraphql({
    schema: schema,
    graphiql: true,
}))
app.listen(5000, () => {
    console.log('Server listening on port 5000!');
});
