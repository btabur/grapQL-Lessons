import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { events,locations, users,participants  } from './data.js';


const typeDefs = `#graphql

type Event {
    id:ID!
    title:String!
    desc:String
    date:String
    from:String
    to:String
    location_id:ID
    user_id:ID
    user:User!
    location:Location!
    participants:[Participant!]!
}
type Location {
    id:ID
    name:String
    desc:String
    lat:Float
    lgn:Float
}
type User {
    id:ID
    username:String
    email:String
    events:[Event!]!
}
type Participant {
    id:ID
    user_id:ID
    event_id:ID
}

type Query {
    #user
    users:[User!]!
    user(id:Int!):User!


    #event
    events:[Event!]!
    event(id:Int!):Event!

    #participants
    participants:[Participant!]!
    participant(id:Int!):Participant!


    #location
    locations:[Location!]!
    location(id:Int!):Location!
    
    
}


`;


const resolvers  = {

    Query: {
        //user
        users: ()=>users,
        user:(parent,args) => users.find(user=>user.id===args.id),

        //events
        events:()=> events,
        event:(parent,args)=> events.find(event=>event.id === args.id),

        //participant
        participants:()=>participants,
        participant:(parent,args)=> participants.find(participant=> participant.id === args.id),

        //location
        locations:()=>locations,
        location:(parent,args)=> locations.find(location => location.id === args.id),
       
  },
  Event: {
    user: (parent)=>users.find(user=>user.id ===parent.user_id),
    location :(parent)=>locations.find(location=>location.id === parent.location_id),
    participants:(parent) => participants.filter(participant=> participant.event_id === parent.id)
  }
}

const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
  });
  
  console.log(`🚀  Server ready at: ${url}`);

