

import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { authors, books } from './data.js';


const typeDefs = `#graphql

type Author {
  id:ID!
  name:String!
  surname:String
  age:Int
  books:[Book!]
}

  type Book {
    id: ID!
    title: String!
    author: Author!
    score: Float
    isPublished:Boolean
  }

  type Query {
    books: [Book!]
    book(id:ID!):Book

    authors:[Author!]
    author(id:ID!):Author
  }
`;

const resolvers  = {
   Query: {
    books:()=>books,
    book:(parent,args) => {
      const data = books.find(book=>book.id===args.id)
      return data
    },
    authors:()=> authors,
    author:(parent,args)=> {
      const data = authors.find((author)=> author.id === args.id)
      return data
    }
   }
};

const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
  });
  
  console.log(`🚀  Server ready at: ${url}`);