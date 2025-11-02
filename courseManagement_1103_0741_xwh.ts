// 代码生成时间: 2025-11-03 07:41:04
import { ApolloServer, gql } from 'apollo-server';
import { mergeResolvers } from 'merge-graphql-schemas';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { addResolversToSchema } from 'graphql-tools';
import { CourseTypeResolver } from './resolvers/CourseTypeResolver';

// Type definitions for Courses
interface Course {
  id: string;
  title: string;
  description: string;
  lecturer: string;
}

// GraphQL Type Definitions
const typeDefs = gql`
  type Query {
    courses: [Course]
    course(id: ID!): Course
  }

  type Mutation {
    addCourse(title: String!, description: String, lecturer: String!): Course
    updateCourse(id: ID!, title: String, description: String, lecturer: String): Course
    deleteCourse(id: ID!): Boolean
  }

  type Course {
    id: ID!
    title: String!
    description: String
    lecturer: String!
  }
`;

// Resolvers for Course type
const resolvers = mergeResolvers([
  CourseTypeResolver,
]);

// Mock data for Courses
const courses: Course[] = [];

// Function to generate unique ID for new courses
function generateId(): string {
  return 'id_' + Date.now();
}

// Resolver for Query type
resolvers.Query.courses = (): Course[] => {
  return courses;
};

// Resolver for Query type for a single course
resolvers.Query.course = (parent, args, context, info): Course | undefined => {
  return courses.find((course) => course.id === args.id);
};

// Resolver for Mutation type to add a course
resolvers.Mutation.addCourse = (parent, args, context, info): Course => {
  const newCourse: Course = {
    id: generateId(),
    title: args.title,
    description: args.description || 'No description provided',
    lecturer: args.lecturer,
  };
  courses.push(newCourse);
  return newCourse;
};

// Resolver for Mutation type to update a course
resolvers.Mutation.updateCourse = (parent, args, context, info): Course | null => {
  const courseIndex = courses.findIndex((course) => course.id === args.id);
  if (courseIndex !== -1) {
    const updatedCourse = {
      ...courses[courseIndex],
      title: args.title || courses[courseIndex].title,
      description: args.description || courses[courseIndex].description,
      lecturer: args.lecturer || courses[courseIndex].lecturer,
    };
    courses[courseIndex] = updatedCourse;
    return updatedCourse;
  }
  return null;
};

// Resolver for Mutation type to delete a course
resolvers.Mutation.deleteCourse = (parent, args, context, info): boolean => {
  const courseIndex = courses.findIndex((course) => course.id === args.id);
  if (courseIndex !== -1) {
    courses.splice(courseIndex, 1);
    return true;
  }
  return false;
};

// Create an executable schema
const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

// Create Apollo Server instance
const server = new ApolloServer({
  schema,
  context: () => ({
    // Context for Apollo Server
  }),
  introspection: true,
  playground: true,
});

// Start the server
server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
