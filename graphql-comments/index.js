import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { users,posts,comments } from './data.js';


const typeDefs = `#graphql

type User {
    id:ID!
    fullName:String!
    posts:[Post!]!
    comments:[Comment!]!
}

type Post {
    id:ID!
    title:String!
    user_id:ID!
    user:User!
    comments:[Comment!]!
}

type Comment {
    id:ID!
    text:String!
    post_id:ID!
    user_id:ID!
    user:User!
    post:Post!
}

type Query {
    #user
    users:[User!]!
    user(id:ID!):User!

    #post
    posts:[Post!]!
    post(id:ID!):Post

    #comment
    comments:[Comment!]!
    comment(id:ID!):Comment!
}


`;


const resolvers  = {

    Query: {
        //user
        users:()=>users,
        user:(parent,args)=> {
            const user = users.find(user=> user.id === args.id)
            if(!user) {
                return new Error('User not found')
            }
            return user
        },
        // posts
        posts:()=>posts,
        post:(parent,args)=> {
            const post = posts.find(post=> post.id === args.id)
            if(!post) {
                return new Error('post not found')
            }
            return post
        },
        //comments
        comments:()=>comments,
        comment:(parent,args)=> {
            const comment = comments.find(comment=> comment.id === args.id)
            if(!comment) {
                return new Error('comment not found')
            }
            return comment
        },

    },
    User: {
        posts:(parent)=> {
            return posts.filter(post => post.user_id=== parent.id)
        },
        comments:(parent)=> comments.filter(comment => comment.user_id === parent.id)
    },
    Post:{
        user: (parent)=> {
            return users.find(user=> user.id=== parent.user_id)
        },
        comments: (parent)=> comments.filter(comment=> comment.post_id === parent.id)
    },
    Comment: {
        user: (parent)=> users.find(user=> user.id=== parent.user_id),
        post: (parent)=> posts.find(post => post.id === parent.post_id)
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
