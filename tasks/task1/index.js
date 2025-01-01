import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { events, locations, users, participants } from "./data.js";
import { nanoid } from "nanoid";

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
input CreateEventInput {
    title:String!
    desc:String!
}
input UpdateEventInput {
    title:String
    desc:String
}
type Location {
    id:ID
    name:String
    desc:String
    lat:Float
    lgn:Float
}
type User {
    id:Int!
    username:String!
    email:String!
    events:[Event!]!
}
type Participant {
    id:ID
    user_id:ID
    event_id:ID
}

input CreateUserInput {
    username:String!
    email:String!
}
input UpdateUserInput {
    username:String
    email:String
}
type DeleteAllOutput {
    count:Int!
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
type Mutation {
    #user 
    createUser(data:CreateUserInput!):User!
    updateUser(id:Int!, data:UpdateUserInput!):User!
    deleteUser(id:Int!):User!
    deleteAllUser:DeleteAllOutput!
    #Event
    createEvent(data:CreateEventInput!):Event!
    updateEvent(id:Int!, data:UpdateEventInput!):Event!
    deleteEvent(id:Int!):Event!
    deleteAllEvent:DeleteAllOutput!
  
}


`;

const resolvers = {
  Mutation: {
    //User
    createUser: (parent, { data: { username, email } }) => {
      const user = { id: nanoid(), username, email };
      users.push(user);
      return user;
    },
    updateUser: (parent, { id, data }) => {
      const user_index = users.findIndex((user) => user.id === id);
      if (user_index === -1) {
        throw new Error("User not fount");
      }
      const updatedUser = (users[user_index] = {
        ...users[user_index],
        ...data,
      });

      return updatedUser;
    },
    deleteUser: (parent, { id }) => {
      const user_index = users.findIndex((user) => user.id === id);
      if (user_index === -1) {
        throw new Error("User not found");
      }
      const deletedUser = users[user_index];
      users.splice(user_index, 1);
      return deletedUser;
    },
    deleteAllUser: () => {
      const length = users.length;
      users.splice(0, length);

      return {
        count: length,
      };
    },

    //Event
     createEvent: (parent, { data: { title, desc } }) => {
        const event = { id: nanoid(), title, desc };
        events.push(event);
        return event;
      },
      updateEvent: (parent, { id, data }) => {
        const event_index = events.findIndex((event) => event.id === id);
        if (event_index === -1) {
          throw new Error("Event not fount");
        }
        const updatedEvent = (events[event_index] = {
          ...events[event_index],
          ...data,
        });
  
        return updatedEvent;
      },
      deleteEvent: (parent, { id }) => {
        const event_index = events.findIndex((event) => event.id === id);
        if (event_index === -1) {
          throw new Error("Event not found");
        }
        const deletedEvent = events[event_index];
        events.splice(event_index, 1);
        return deletedEvent;
      },
      deleteAllEvent: () => {
        const length = events.length;
        events.splice(0, length);
  
        return {
          count: length,
        };
      },
  },

  Query: {
    //user
    users: () => users,
    user: (parent, args) => users.find((user) => user.id === args.id),

    //events
    events: () => events,
    event: (parent, args) => events.find((event) => event.id === args.id),

    //participant
    participants: () => participants,
    participant: (parent, args) =>
      participants.find((participant) => participant.id === args.id),

    //location
    locations: () => locations,
    location: (parent, args) =>
      locations.find((location) => location.id === args.id),
  },
  Event: {
    user: (parent) => users.find((user) => user.id === parent.user_id),
    location: (parent) =>
      locations.find((location) => location.id === parent.location_id),
    participants: (parent) =>
      participants.filter((participant) => participant.event_id === parent.id),
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
});

console.log(`🚀  Server ready at: ${url}`);
