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
  GraphQLString,
} from 'graphql';

import { ChangePostInput, CreatePostInput, Post } from './types/post.js';
import { memberType, memberTypeEnum } from './types/memberType.js';

import { ChangeUserInput, CreateUserInput, User } from './types/user.js';
import { ChangeProfileInput, CreateProfileInput, Profile } from './types/profile.js';
import { UUIDType } from './types/uuid.js';
import { GraphQLContext } from './type.js';
import depthLimit from 'graphql-depth-limit';
import { MemberTypeId } from '../member-types/schemas.js';

const queryType = new GraphQLObjectType<unknown, GraphQLContext>({
  name: 'RootQueryType',
  fields: () => ({
    memberType: {
      type: memberType,
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
      type: User,
      args: {
        id: {
          type: new GraphQLNonNull(UUIDType),
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
      type: Profile,
      args: {
        id: {
          type: new GraphQLNonNull(UUIDType),
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
      type: Post,
      args: {
        id: {
          type: new GraphQLNonNull(UUIDType),
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

const mutationType = new GraphQLObjectType<unknown, GraphQLContext>({
  name: 'Mutations',
  fields: () => ({
    createUser: {
      type: new GraphQLNonNull(User),
      args: {
        dto: {
          type: new GraphQLNonNull(CreateUserInput),
        },
      },
      resolve: async (
        _src,
        { dto }: { dto: { name: string; balance: number } },
        { prisma },
      ) => {
        const user = await prisma.user.create({
          data: dto,
        });
        return user;
      },
    },
    createProfile: {
      type: new GraphQLNonNull(Profile),
      args: {
        dto: {
          type: new GraphQLNonNull(CreateProfileInput),
        },
      },
      resolve: async (
        _src,
        {
          dto,
        }: {
          dto: {
            userId: string;
            isMale: boolean;
            yearOfBirth: number;
            memberTypeId: MemberTypeId;
          };
        },
        { prisma },
      ) => {
        const profile = await prisma.profile.create({
          data: dto,
        });
        return profile;
      },
    },

    createPost: {
      type: new GraphQLNonNull(Post),
      args: {
        dto: {
          type: new GraphQLNonNull(CreatePostInput),
        },
      },
      resolve: async (
        _src,
        { dto }: { dto: { title: string; content: string; authorId: string } },
        { prisma },
      ) => {
        const post = await prisma.post.create({
          data: dto,
        });
        return post;
      },
    },
    // input ChangePostInput {
    //   title: String
    //   content: String
    // }
    changePost: {
      type: new GraphQLNonNull(Post),
      args: {
        id: {
          type: new GraphQLNonNull(UUIDType),
        },
        dto: {
          type: new GraphQLNonNull(ChangePostInput),
        },
      },
      resolve: async (
        _src,
        { dto, id }: { dto: { title: string; content: string }; id: string },
        { prisma },
      ) => {
        const post = prisma.post.update({
          where: {
            id: id,
          },
          data: dto,
        });
        return post;
      },
    },
    //   changeProfile(id: UUID!, dto: ChangeProfileInput!): !Profile
    // input ChangeProfileInput {
    //   isMale: Boolean
    //   yearOfBirth: Int
    //   memberTypeId: MemberTypeId
    // }

    changeProfile: {
      type: new GraphQLNonNull(Profile),
      args: {
        id: {
          type: new GraphQLNonNull(UUIDType),
        },
        dto: {
          type: new GraphQLNonNull(ChangeProfileInput),
        },
      },
      resolve: async (
        _src,
        {
          dto,
          id,
        }: {
          dto: { isMale: boolean; yearOfBirth: number; memberTypeId: MemberTypeId };
          id: string;
        },
        { prisma },
      ) => {
        const profile = prisma.profile.update({
          where: {
            id: id,
          },
          data: dto,
        });
        return profile;
      },
    },
    //   changeUser(id: UUID!, dto: ChangeUserInput!): User!
    changeUser: {
      type: new GraphQLNonNull(User),
      args: {
        id: {
          type: new GraphQLNonNull(UUIDType),
        },
        dto: {
          type: new GraphQLNonNull(ChangeUserInput),
        },
      },
      resolve: async (
        _src,
        { dto, id }: { dto: { name: string; balance: number }; id: string },
        { prisma },
      ) => {
        const user = await prisma.user.update({
          where: {
            id: id,
          },
          data: dto,
        });
        return user;
      },
    },
    //   deleteUser(id: UUID!): String!
    deleteUser: {
      type: GraphQLString,
      args: {
        id: {
          type: new GraphQLNonNull(UUIDType),
        },
      },
      resolve: async (_src, { id }: { id: string }, { prisma }) => {
        await prisma.user.delete({
          where: {
            id: id,
          },
        });
        return null;
      },
    },
    //   deletePost(id: UUID!): String!
    deletePost: {
      type: GraphQLString,
      args: {
        id: {
          type: new GraphQLNonNull(UUIDType),
        },
      },
      resolve: async (_src, { id }: { id: string }, { prisma }) => {
        await prisma.post.delete({
          where: {
            id: id,
          },
        });
        return null;
      },
    },
    // deleteProfile(id: UUID!): String!
    deleteProfile: {
      type: GraphQLString,
      args: {
        id: {
          type: new GraphQLNonNull(UUIDType),
        },
      },
      resolve: async (_src, { id }: { id: string }, { prisma }) => {
        await prisma.post.delete({
          where: {
            id: id,
          },
        });
        return null;
      },
    },

    subscribeTo: {
      type: new GraphQLNonNull(User),
      args: {
        userId: {
          type: new GraphQLNonNull(UUIDType),
        },
        authorId: {
          type: new GraphQLNonNull(UUIDType),
        },
      },
      resolve: async (
        _src,
        { userId, authorId }: { userId: string; authorId: string },
        { prisma },
      ) => {
        return await prisma.subscribersOnAuthors.create({
          data: {
            subscriberId: userId,
            authorId: authorId,
          },
        });
      },
    },

    unsubscribeFrom: {
      type: new GraphQLNonNull(User),
      args: {
        userId: {
          type: new GraphQLNonNull(UUIDType),
        },
        authorId: {
          type: new GraphQLNonNull(UUIDType),
        },
      },
      resolve: async (
        _src,
        { userId, authorId }: { userId: string; authorId: string },
        { prisma },
      ) => {
        return await prisma.subscribersOnAuthors.delete({
          where: {
            subscriberId_authorId: {
              subscriberId: userId,
              authorId: authorId,
            },
          },
        });
      },
    },
  }),
});

const schema = new GraphQLSchema({
  query: queryType,
  mutation: mutationType,
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
