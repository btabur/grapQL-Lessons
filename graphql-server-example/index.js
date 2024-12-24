

import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';

const author = {
  id:1,
  name:'Albert',
  surname:'Camus',
  age:40,
  books : [{
    id:'vszvdv',
    title:'test title',
    score:7.4,
    isPublished:false
  }]
}

const book = {
  id:'sgbsbxfb',
  title:'Yabancı',
  author,
  score:5.7,
  isPublished:true
}



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
    book: Book
    author:Author
  }
`;

const resolvers  = {
   Query: {
    book:()=>book,
    author:()=> author
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