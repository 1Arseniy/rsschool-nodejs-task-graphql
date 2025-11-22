import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { createGqlResponseSchema, gqlResponseSchema } from './schemas.js';
import {
  graphql,
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLList,
  validate,
  specifiedRules,
  parse,
} from 'graphql';

import { Post } from './types/post.js';
import { memberType, memberTypeEnum } from './types/memberType.js';

import { User } from './types/user.js';
import { Profile } from './types/profile.js';
import { UUIDType } from './types/uuid.js';
import { GraphQLContext } from './type.js';
import depthLimit from 'graphql-depth-limit';

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
      resolve: async (_src, { id }: { id: string }, { prisma }) => {
        return (
          (await prisma.memberType.findUnique({
            where: {
              id,
            },
          })) || null
        );
      },
    },

    memberTypes: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(memberType))),
      resolve: async (_src, _args, { prisma }) => {
        return await prisma.memberType.findMany();
      },
    },

    user: {
      type: new GraphQLNonNull(User),
      args: {
        id: {
          type: UUIDType,
        },
      },
      resolve: async (_src, { id }: { id: string }, { prisma }) => {
        return (
          (await prisma.user.findUnique({
            where: {
              id,
            },
          })) || null
        );
      },
    },

    users: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(User))),
      resolve: async (_src, _args, { prisma }) => {
        return await prisma.user.findMany();
      },
    },

    profile: {
      type: new GraphQLNonNull(Profile),
      args: {
        id: {
          type: UUIDType,
        },
      },
      resolve: async (_src, { id }: { id: string }, { prisma }) => {
        return (
          (await prisma.profile.findUnique({
            where: {
              id,
            },
          })) || null
        );
      },
    },

    profiles: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(Profile))),
      resolve: async (_src, _args, { prisma }) => {
        return await prisma.profile.findMany();
      },
    },

    post: {
      type: new GraphQLNonNull(Post),
      args: {
        id: {
          type: UUIDType,
        },
      },
      resolve: async (_src, { id }: { id: string }, { prisma }) => {
        return (await prisma.post.findUnique({ where: { id } })) || null;
      },
    },

    posts: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(Post))),
      resolve: async (_src, _args, { prisma }) => {
        return await prisma.post.findMany();
      },
    },
  }),
});

const schema = new GraphQLSchema({
  query: queryType,
});

const maxDepth = 5;

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
    async handler(req, res) {
      const document = parse(req.body.query);
      const errors = validate(schema, document, [
        ...specifiedRules,
        depthLimit(maxDepth),
      ]);

      if (errors.length > 0) {
        return res.send({ errors });
      }

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
