// 代码生成时间: 2025-10-07 17:58:42
import { ApolloServer, gql } from 'apollo-server';
import { calculateOptionPrice } from './optionPricingFunctions';

// Define the type definitions for the GraphQL schema
const typeDefs = gql`
  type Query {
    optionPrice(S: Float!, K: Float!, T: Float!, r: Float!, sigma: Float!): Float
  }
`;

// Define the resolvers for the GraphQL schema
const resolvers = {
  Query: {
    optionPrice: async (_, { S, K, T, r, sigma }) => {
      // Validate input
      if (S <= 0 || K <= 0 || T <= 0 || r < 0 || sigma <= 0) {
        throw new Error("Invalid input values for option pricing");
      }
      // Calculate the option price using the Black-Scholes model
      const price = calculateOptionPrice(S, K, T, r, sigma);
      return price;
    }
  }
};

// Create an instance of ApolloServer with the type definitions and resolvers
const server = new ApolloServer({
  typeDefs,
  resolvers
});

// Start the server
server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`);
});

// Function to calculate the option price using the Black-Scholes model
// Note: This is a simplified version and assumes European call option pricing
function calculateOptionPrice(S: number, K: number, T: number, r: number, sigma: number): number {
  // Import the math library
  const { sqrt, exp, log, pow } = Math;
  
  // Black-Scholes formula components
  const d1 = (log(S / K) + (r + sigma * sigma / 2) * T) / (sigma * sqrt(T));
  const d2 = d1 - sigma * sqrt(T);
  
  // Calculate the call and put prices
  const callPrice = S * exp(-r * T) * cumulativeNormalDistribution(d1) - K * exp(-r * T) * cumulativeNormalDistribution(d2);
  const putPrice = -S * exp(-r * T) * cumulativeNormalDistribution(-d1) + K * exp(-r * T) * cumulativeNormalDistribution(-d2);
  
  // Return the call price for this implementation
  return callPrice;
}

// Cumulative normal distribution function
function cumulativeNormalDistribution(x: number): number {
  // Implementation of the cumulative distribution function for the standard normal distribution
  // This could be replaced with a more precise library function or approximation
  const a1 = 0.319381530, a2 = -0.356563782, a3 = 1.781477937, a4 = -1.821255978, a5 = 1.330274429;
  const p = 0.3275911;
  
  let sign = 1;
  if (x < 0) {
    sign = -1;
  }
  const t = 1 / (1 + p * Math.abs(x));
  const u = a1 * t + a2 * t * t + a3 * t * t * t + a4 * t * t * t * t + a5 * t * t * t * t * t;
  const cnd = 0.5 * (1 + sign * u) + 0.5;
  return cnd;
}
