// 代码生成时间: 2025-10-09 03:06:23
import { ApolloServer, gql } from 'apollo-server';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { mergeResolvers } from '@graphql-tools/merge';
import { IResolvers } from '@graphql-tools/utils';

// Define the type definitions for the clinical trial
const typeDefs = gql`
  type ClinicalTrial {
    id: ID!
    title: String!
    description: String
    startDate: String
    endDate: String
    status: String
  }

  type Query {
    getClinicalTrial(id: ID!): ClinicalTrial
    getClinicalTrials: [ClinicalTrial]
  }

  type Mutation {
    createClinicalTrial(title: String!, description: String, startDate: String, endDate: String, status: String): ClinicalTrial
    updateClinicalTrial(id: ID!, title: String, description: String, startDate: String, endDate: String, status: String): ClinicalTrial
    deleteClinicalTrial(id: ID!): ClinicalTrial
  }
`;

// Mock database for clinical trials
const clinicalTrials: {[id: string]: any} = {};

// Resolvers for the GraphQL schema
const resolvers: IResolvers = {
  Query: {
    getClinicalTrial: (_, { id }) => clinicalTrials[id] || null,
    getClinicalTrials: () => Object.values(clinicalTrials),
  },
  Mutation: {
    createClinicalTrial: (_, { title, description, startDate, endDate, status }) => {
      const trialId = Date.now().toString(); // Simple ID generation
      clinicalTrials[trialId] = {
        id: trialId,
        title,
        description,
        startDate,
        endDate,
        status,
      };
      return clinicalTrials[trialId];
    },
    updateClinicalTrial: (_, { id, title, description, startDate, endDate, status }) => {
      if (!clinicalTrials[id]) {
        throw new Error(`Clinical trial with ID ${id} not found`);
      }
      clinicalTrials[id] = {
        ...clinicalTrials[id],
        title,
        description,
        startDate,
        endDate,
        status,
      };
      return clinicalTrials[id];
    },
    deleteClinicalTrial: (_, { id }) => {
      if (!clinicalTrials[id]) {
        throw new Error(`Clinical trial with ID ${id} not found`);
      }
      const deletedTrial = clinicalTrials[id];
      delete clinicalTrials[id];
      return deletedTrial;
    },
  },
};

// Create an executable schema
const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

// Create an Apollo Server instance
const server = new ApolloServer({
  schema,
  context: () => ({
    // Additional context properties can be added here
  }),
  errors: {
    formatError: (error) => {
      // Log error details or transform error messages
      console.error(error);
      return error;
    },
  },
});

// Start the server
server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
