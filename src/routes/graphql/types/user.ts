import {
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
  GraphQLFloat,
  GraphQLList,
} from 'graphql';
import { Profile, TypeProfile } from './profile.js';
import { Post, TypePosts } from './post.js';
import { GraphQLContext } from '../type.js';
import { UUIDType } from './uuid.js';
import { subscribeToUserSchema } from '../../users/_userId/user-subscribed-to/schemas.js';

export type TypeUser = {
  id: string;
  name: string;
  balance: number;
  profile: TypeProfile | null;
  posts: TypePosts;
  userSubscribedTo: TypeUsers;
  subscribedToUser: TypeUsers;
};

export type TypeUsers = TypeUser[];

export const User = new GraphQLObjectType<TypeUser, GraphQLContext>({
  name: 'User',
  fields: () => ({
    id: {
      type: new GraphQLNonNull(UUIDType),
    },
    name: {
      type: new GraphQLNonNull(GraphQLString),
    },
    balance: {
      type: new GraphQLNonNull(GraphQLFloat),
    },
    profile: {
      type: Profile,
      resolve: async (src, _args, { prisma }) => {
        return (await prisma.profile.findUnique({ where: { id: src.id } })) || null;
      },
    },
    posts: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(Post))),
      resolve: async (src, _args, { prisma }) => {
        return await prisma.post.findUnique({
          where: {
            id: src.id,
          },
        });
      },
    },
    userSubscribedTo: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(User))),
      resolve: async (src, _args, { prisma }) => {
        // const a = await prisma.subscribersOnAuthors({
        //   where: {
        //     aut
        //   }
        // })
        return await prisma.user.findMany({
          where: {
            userSubscribedTo: {
              some: {
                subscriber: {
                  id: src.id,
                },
              },
            },
          },
        });
      },
    },
    subscribedToUser: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(User))),
      resolve: (src, _args, { prisma }) => {
        return prisma.user.findMany({
          where: {
            subscribedToUser: {
              some: {
                author: {
                  id: src.id,
                },
              },
            },
          },
        });
      },
    },
  }),
});
