// 代码生成时间: 2025-10-26 23:32:27
import { ApolloServer } from 'apollo-server';
import { typeDefs } from './schema';
import { resolvers } from './resolvers';

// Define the ClusterAnalysis class which encapsulates the functionality of the tool.
class ClusterAnalysis {
  private server: ApolloServer;

  constructor() {
    this.server = new ApolloServer({
      typeDefs,
      resolvers,
    });
  }

  // Start the server and listen for incoming requests.
  public async startServer(): Promise<void> {
    try {
      await this.server.listen({
        port: 4000
      });
      console.log('🚀 Server is running on http://localhost:4000${server.graphqlPath}');
    } catch (error) {
      console.error('Failed to start the server:', error);
    }
  }
}

// Entry point of the application.
const main = async () => {
  const analysisTool = new ClusterAnalysis();
  await analysisTool.startServer();
};

// Ensure the main function runs only once.
main();