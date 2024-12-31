import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { users,posts,comments } from './data.js';
import {nanoid} from 'nanoid';


const typeDefs = `#graphql

type User {
    id:ID!
    fullName:String!
    age:Int!
    posts:[Post!]!
    comments:[Comment!]!
}
input CreateUserInput {
    fullName:String!
    age:Int!
}
input UpdateUserInput {
    fullName:String
    age:Int
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
input UpdatePostInput {
    title:String,
    user_id:ID
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
input UpdateCommentInput {
    text:String
    post_id:ID
    user_id:ID
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
    #user
    createUser(data:CreateUserInput!):User!
    updateUser(id:ID!, data:UpdateUserInput!):User!
    deleteUser(id:ID!):User!
    #post
    createPost(data:CreatePostInput!):Post!
    updatePost(id:ID!,data:UpdatePostInput!):Post!
    deletePost(id:ID!):Post!
    #comment
    createComment(data:CreateCommentInput!): Comment!
    updateComment(id:ID!,data:UpdateCommentInput!):Comment!
    deletedComment(id:ID!):Comment!
}


`;


const resolvers  = {

    Mutation :{
        //User
        createUser:(parent,{data:{fullName,age}})=> {
            const user ={id:nanoid(),fullName,age }
            users.push(user)

            return user
        },
        updateUser:(parent,{id,data})=> {
            const user_index =users.findIndex(user=>user.id===id)
            if(user_index === -1) {
                throw new Error('User not fount')    
            }
           const updatedUser = users[user_index] ={
            ...users[user_index],
            ...data
           }

            return updatedUser
        },
        deleteUser:(parent,{id})=> {
            const user_index = users.findIndex(user => user.id ===id)
            if(user_index === -1) {
                throw new Error("User not found")
            }
            const deletedUser = users[user_index]
            users.splice(user_index,1)
            return deletedUser

        },
        //Post
        createPost:(parent,args)=> {
            const post = {
                id:nanoid(),
                title:args.data.title,
                user_id:args.data.user_id
            }
            posts.push(post)

            return post
        },
        updatePost: (parent,{id,data})=> {
                const post_index = posts.findIndex(post => post.id ===id)
                if (post_index===-1) {
                    throw new Error("post not found")
                }
              const updatedPost = posts[post_index]={
                ...posts[post_index],
                ...data
               }
               return updatedPost
        },  
        deletePost:(parent,{id})=> {
            const post_index = posts.findIndex(post => post.id ===id)
            if(post_index === -1) {
                throw new Error("post not found")
            }
            const deletedPost = posts[post_index]
            posts.splice(post_index,1)
            return deletedPost

        },
        createComment :(parent, {data})=> {
            const comment = {
                id:nanoid(),
                ...data
            }
            comments.push(comment);
            return comment;
        },
        updateComment :(parent, {id,data})=> {
            const comment_index = comments.findIndex(comment=> comment.id ===id)

            if(comment_index === -1) {
                throw new Error('Comment not found')
            }
            const updatedComment = comments[comment_index]= {
                ...comments[comment_index],
                ...data
            }

            return upda
        },
        deleteComment:(parent,{id})=> {
            const comment_index = comments.findIndex(comment => comment.id ===id)
            if(comment_index === -1) {
                throw new Error("Comment not found")
            }
            const deletedComment = comments[comment_index]
            comments.splice(comment_index,1)
            return deletedComment

        },
       
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

