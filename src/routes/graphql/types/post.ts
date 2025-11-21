// import { UUID } from 'crypto';
import { GraphQLID, GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql';
import { GraphQLContext } from '../type.js';
import { UUIDType } from './uuid.js';

export type TypePost = {
  id: string;
  title: string;
  content: string;
};

export type TypePosts = TypePost[];

export const Post = new GraphQLObjectType<TypePost, GraphQLContext>({
  name: 'Post',
  fields: () => ({
    id: {
      type: new GraphQLNonNull(UUIDType),
    },
    title: {
      type: new GraphQLNonNull(GraphQLString),
    },
    content: {
      type: new GraphQLNonNull(GraphQLString),
    },
  }),
});
