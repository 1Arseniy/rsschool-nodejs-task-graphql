import {
  GraphQLID,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
  GraphQLFloat,
  GraphQLList,
} from 'graphql';
import { Profile, TypeProfile } from './profile.js';
import { Post, TypePosts } from './post.js';
import { UUID } from 'crypto';
import { GraphQLContext } from '../type.js';
import { UUIDType } from './uuid.js';

export type TypeUser = {
  id: string;
  name: string;
  balance: number;
  profile: TypeProfile;
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
      resolve: (src, _args, { prisma }) => {
        return prisma.profile.findUnique({ where: { id: src.id } });
      },
    },
    posts: {
      type: new GraphQLNonNull(new GraphQLList(Post)),
    },
    userSubscribedTo: {
      type: new GraphQLNonNull(new GraphQLList(User)),
      resolve: (src, _args, { prisma }) => {
        return prisma.user.findMany({
          where: {
            userSubscribedTo: {
              some: {
                subscriberId: src.id,
              },
            },
          },
        });
      },
    },
    subscribedToUser: {
      type: new GraphQLNonNull(new GraphQLList(User)),
      resolve: (src, _args, { prisma }) => {
        return prisma.user.findMany({
          where: {
            subscribedToUser: {
              some: {
                authorId: src.id,
              },
            },
          },
        });
      },
    },
  }),
});
