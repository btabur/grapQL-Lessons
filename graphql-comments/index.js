import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { users,posts,comments } from './data.js';
import {nanoid} from 'nanoid';


const typeDefs = `#graphql

type User {
    id:ID!
    fullName:String!
    posts:[Post!]!
    comments:[Comment!]!
}
input CreateUserInput {
    fullName:String!
}

type Post {
    id:ID!
    title:String!
    user_id:ID!
    user:User!
    comments:[Comment!]!
}
input CreatePostInput {
    title:String!
    user_id:ID!

}

type Comment {
    id:ID!
    text:String!
    post_id:ID!
    user_id:ID!
    user:User!
    post:Post!
}

input CreateCommentInput {
    text:String!
     post_id:ID!
    user_id:ID!
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

type Mutation {
    createUser(data:CreateUserInput!):User!
    createPost(data:CreatePostInput!):Post!
    createComment(data:CreateCommentInput!): Comment!
}


`;


const resolvers  = {

    Mutation :{
        createUser:(parent,{data:{fullName}})=> {
            const user ={id:nanoid(),fullName:fullName}
            users.push(user)

            return user
        },
        createPost:(parent,args)=> {
            const post = {
                id:nanoid(),
                title:args.data.title,
                user_id:args.data.user_id
            }
            posts.push(post)

            return post
        },
        createComment :(parent, {data})=> {
            const comment = {
                id:nanoid(),
                ...data
            }
            comments.push(comment);
            return comment;
        }
    },

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

