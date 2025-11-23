import {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLBoolean,
  GraphQLInt,
  GraphQLInputObjectType,
} from 'graphql';
import { memberType, memberTypeEnum, TypeMemberType } from './memberType.js';
import { GraphQLContext } from '../type.js';
import { UUIDType } from './uuid.js';

export type TypeProfile = {
  id: string;
  isMale: boolean;
  yearOfBirth: number;
  memberType: TypeMemberType;
};

export type TypeProfiles = TypeProfile[];

export const Profile = new GraphQLObjectType<TypeProfile, GraphQLContext>({
  name: 'Profile',
  fields: () => ({
    id: {
      type: new GraphQLNonNull(UUIDType),
    },
    isMale: {
      type: new GraphQLNonNull(GraphQLBoolean),
    },
    yearOfBirth: {
      type: new GraphQLNonNull(GraphQLInt),
    },
    memberType: {
      type: new GraphQLNonNull(memberType),
      resolve: async (src, _, { prisma }) => {
        return prisma.profile.findUnique({ where: { id: src.id } });
      },
    },
  }),
});

export const ChangeProfileInput = new GraphQLInputObjectType({
  name: 'ChangeProfileInput',
  fields: () => ({
    isMale: { type: GraphQLBoolean },
    yearOfBirth: { type: GraphQLInt },
    memberTypeId: { type: memberTypeEnum },
  }),
});

export const CreateProfileInput = new GraphQLInputObjectType({
  name: 'CreateProfileInput',
  fields: () => ({
    userId: {
      type: new GraphQLNonNull(UUIDType),
    },
    isMale: {
      type: new GraphQLNonNull(GraphQLBoolean),
    },
    yearOfBirth: {
      type: new GraphQLNonNull(GraphQLInt),
    },
    memberTypeId: {
      type: new GraphQLNonNull(memberTypeEnum),
    },
  }),
});
