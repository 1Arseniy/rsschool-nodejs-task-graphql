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
import { randomUUID, UUID } from 'crypto';

import { TypePosts, Post } from './types/post.js';
import {
  memberType,
  memberTypeEnum,
  TypeMemberTypes,
  MemberTypeId,
} from './types/memberType.js';

import { User, TypeUsers } from './types/user.js';
import { Profile, TypeProfiles } from './types/profile.js';
import { PrismaClient } from '@prisma/client';
import { UUIDType } from './types/uuid.js';
import { GraphQLContext } from './type.js';

const queryType = new GraphQLObjectType<unknown, GraphQLContext>({
  name: 'RootQueryType',
  fields: () => ({
    memberType: {
      type: new GraphQLNonNull(memberType),
      args: {
        id: {
          type: new GraphQLNonNull(memberTypeEnum),
        },
      },
      resolve: (_src, { id }: { id: string }, { prisma }) => {
        return prisma.memberType.findUnique({
          where: {
            id,
          },
        });
      },
    },

    memberTypes: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(memberType))),
      resolve: async (_src, _args, { prisma }) => {
        return prisma.memberType.findMany();
      },
    },

    user: {
      type: new GraphQLNonNull(User),
      args: {
        id: {
          type: new GraphQLNonNull(GraphQLID),
        },
      },
      resolve: (_src, { id }: { id: string }, { prisma }) => {
        return prisma.user.findUnique({
          where: {
            id,
          },
        });
      },
    },

    users: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(User))),
      resolve: async (_src, _args, { prisma }) => {
        return prisma.user.findMany();
      },
    },

    profile: {
      type: new GraphQLNonNull(Profile),
      args: {
        id: {
          type: new GraphQLNonNull(GraphQLID),
        },
      },
      resolve: (_src, { id }: { id: string }, { prisma }) => {
        return prisma.profile.findUnique({
          where: {
            id,
          },
        });
      },
    },

    profiles: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(Profile))),
      resolve: async (_src, _args, { prisma }) => {
        return prisma.profile.findMany();
      },
    },

    post: {
      type: new GraphQLNonNull(Post),
      args: {
        id: {
          type: new GraphQLNonNull(GraphQLID),
        },
      },
      resolve: (_src, { id }: { id: string }, { prisma }) => {
        return prisma.post.findUnique({
          where: {
            id,
          },
        });
      },
    },

    posts: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(Post))),
      resolve: async (_src, _args, { prisma }) => {
        return prisma.post.findMany();
      },
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
        contextValue: { prisma },
      });
    },
  });
};

export default plugin;
