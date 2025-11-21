import {
  GraphQLObjectType,
  GraphQLID,
  GraphQLNonNull,
  GraphQLBoolean,
  GraphQLInt,
} from 'graphql';
import { memberType, TypeMemberType } from './memberType.js';
import { UUID } from 'crypto';
import { GraphQLContext } from '../type.js';
import { UUIDType } from './uuid.js';

export type TypeProfile = {
  id: UUID;
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
    },
  }),
});
