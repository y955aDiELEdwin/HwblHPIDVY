// 代码生成时间: 2025-10-05 01:35:23
// content_management_system.ts
// This file defines a basic content management system using TypeScript and GraphQL.

import { ApolloServer, gql } from 'apollo-server';
import { readFileSync } from 'fs';

// Define the GraphQL schema with types and queries
const typeDefs = gql`
  type Query {
    getContent(id: ID!): Content
    listContents: [Content]
  }

  type Content {
    id: ID!
    title: String
    content: String
    createdAt: String
  }

  type Mutation {
    addContent(title: String!, content: String!): Content
    updateContent(id: ID!, title: String, content: String): Content
    deleteContent(id: ID!): Boolean
  }
`;

// Sample in-memory data store for the contents
const contents: { [id: string]: any } = {};

// Sample data for demonstration purposes
const initialContents = [
  { id: '1', title: 'Introduction to GraphQL', content: 'GraphQL is a query language...', createdAt: '2023-01-01' },
  { id: '2', title: 'Apollo Server Basics', content: 'Apollo Server is a community-driven...', createdAt: '2023-01-02' }
];

// Initialize the contents with initial data
initialContents.forEach((content: any) => {
  contents[content.id] = content;
});

// Resolvers define the technique for fetching the types in the schema.
const resolvers = {
  Query: {
    getContent: (_parent, args: any) => {
      const { id } = args;
      return contents[id] || new Error('Content not found');
    },
    listContents: () => {
      return Object.values(contents);
    }
  },
  Mutation: {
    addContent: (_parent, args: any) => {
      const { title, content } = args;
      const newContent = {
        id: (parseInt(Object.keys(contents).pop() as any) + 1).toString(),
        title,
        content,
        createdAt: new Date().toISOString()
      };
      contents[newContent.id] = newContent;
      return newContent;
    },
    updateContent: (_parent, args: any) => {
      const { id, title, content } = args;
      const existingContent = contents[id];
      if (!existingContent) {
        return new Error('Content not found');
      }
      const updatedContent = { ...existingContent, title, content };
      contents[id] = updatedContent;
      return updatedContent;
    },
    deleteContent: (_parent, args: any) => {
      const { id } = args;
      if (!contents[id]) {
        return new Error('Content not found');
      }
      delete contents[id];
      return true;
    }
  }
};

// Create an instance of ApolloServer with the schema and resolvers
const server = new ApolloServer({ typeDefs, resolvers });

// Start the server
server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
