// 代码生成时间: 2025-10-17 16:26:09
 * It includes error handling, comments, and follows best practices for maintainability and scalability.
 */

import { GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLSchema, GraphQLNonNull } from 'graphql';
import { GraphQLServer } from 'graphql-yoga';
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

// Define the GraphQL type for the image resizing input
const ImageInputType = new GraphQLObjectType({
  name: 'ImageInput',
  fields: {
    src: { type: new GraphQLNonNull(GraphQLString) },
    dest: { type: new GraphQLNonNull(GraphQLString) },
    width: { type: GraphQLInt },
    height: { type: GraphQLInt },
  },
});

// Define the GraphQL type for the response
const ImageResizeResponseType = new GraphQLObjectType({
  name: 'ImageResizeResponse',
  fields: {
    source: { type: GraphQLString },
    destination: { type: GraphQLString },
    status: { type: GraphQLString },
  },
});

// Define the GraphQL mutation for image resizing
const ImageResizeMutation = {
  type: ImageResizeResponseType,
  args: { imageInput: { type: new GraphQLNonNull(ImageInputType) } },
  resolve: async (_, args) => {
    try {
      // Read the source image file
      const srcPath = path.resolve(args.imageInput.src);
      if (!fs.existsSync(srcPath)) {
        throw new Error('Source image file does not exist.');
      }

      // Define the destination path and resize parameters
      const destPath = path.resolve(args.imageInput.dest);
      const width = args.imageInput.width ? args.imageInput.width : null;
      const height = args.imageInput.height ? args.imageInput.height : null;

      // Resize the image
      await sharp(srcPath)
        .resize({ width, height })
        .toFile(destPath);

      // Return the success response
      return {
        source: srcPath,
        destination: destPath,
        status: 'success',
      };
    } catch (error) {
      // Return the error response
      return {
        source: args.imageInput.src,
        destination: args.imageInput.dest,
        status: 'error',
      };
    }
  },
};

// Construct the schema
const schema = new GraphQLSchema({
  mutation: new GraphQLObjectType({
    name: 'Mutation',
    fields: {
      resizeImage: ImageResizeMutation,
    },
  }),
});

// Initialize the GraphQL server
const server = new GraphQLServer({
  schema,
  context: req => ({ ...req, ...{ user: { name: 'John Doe' } } }),
});

// Start the server
server.start(() => {
  console.log('Server is running on http://localhost:4000/');
});