import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { createGqlResponseSchema, gqlResponseSchema } from './schemas.js';
import {
  graphql,
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLID,
  GraphQLNonNull,
  GraphQLList,
} from 'graphql';
import { randomUUID } from 'crypto';

import { TypePosts, Post } from './types/post.js';
import {
  memberType,
  memberTypeEnum,
  TypeMemberTypes,
  MemberTypeId,
} from './types/memberType.js';

const posts: TypePosts = [{ id: randomUUID(), title: 'ss', content: 'kkk' }];
const memberTypes: TypeMemberTypes = [{ id: 1, discount: 1, postsLimitPerMonth: 32435 }];

const queryType = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: () => ({
    memberType: {
      type: memberType,
      args: {
        id: {
          type: memberTypeEnum,
        },
      },
      resolve: (_src, { id }: { id: MemberTypeId }) => {
        return memberTypes.find((memberType) => memberType.id === id);
      },
    },
    memberTypes: {
      type: new GraphQLNonNull(new GraphQLList(memberType)),
      resolve: () => memberTypes,
    },

    post: {
      type: Post,
      args: {
        id: {
          type: new GraphQLNonNull(GraphQLID),
        },
      },
      resolve: (_src, { id }: { id: string }) => {
        return posts.find((post) => post.id === id);
      },
    },
    posts: {
      type: new GraphQLNonNull(new GraphQLList(Post)),
      resolve: () => posts,
    },
  }),
});

const schema = new GraphQLSchema({
  query: queryType,
});

const plugin: FastifyPluginAsyncTypebox = async (fastify) => {
  const { prisma } = fastify;

  fastify.route({
    url: '/',
    method: 'POST',
    schema: {
      ...createGqlResponseSchema,
      response: {
        200: gqlResponseSchema,
      },
    },
    async handler(req) {
      return graphql({
        schema,
        source: req.body.query,
        variableValues: req.body.variables,
      });
    },
  });
};

export default plugin;
