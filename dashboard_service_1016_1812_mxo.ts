// 代码生成时间: 2025-10-16 18:12:34
import { ApolloServer } from 'apollo-server';
import { buildSchema } from 'type-graphql';
import { DataSources } from './datasources';
import { DashboardResolver } from './resolvers';
import { errorLogger } from './logger';

// Define GraphQL schema by using TypeGraphQL decorators and classes.
async function bootstrap() {
  try {
    // Build the GraphQL schema using TypeGraphQL.
    const schema = await buildSchema({
      resolvers: [DashboardResolver],
      authChecker: authChecker,
      // Other schema options can be added here.
    });

    // Create an ApolloServer instance with the schema.
    const server = new ApolloServer({
      schema,
      context: ({ req }) => ({
        // You can add additional context information here, e.g., user data.
        dataSources: new DataSources(),
      }) as { dataSources: DataSources },
      formatError: errorFormatter,
      debug: process.env.NODE_ENV !== 'production',
    });

    // Start the server and listen for requests on the specified port.
    const { url } = await server.listen(process.env.PORT || 4000);
    console.log(`🚀 Server ready at ${url}`);
  } catch (error) {
    errorLogger(error);
  }
}

// Define an authentication checker function for TypeGraphQL.
async function authChecker({ context }: { context: any }) {
  // Implement your authentication logic here.
  // For now, it just allows everyone to access.
  return true;
}

// Define an error formatter function for Apollo Server.
function errorFormatter(error: any) {
  // Format or transform the error details before sending them to the client.
  if (error.originalError) {
    return error.originalError.message;
  }
  return error.message;
}

// Run the bootstrap function to start the GraphQL service.
bootstrap();

// Export the bootstrap function for testing purposes.
export { bootstrap };
