import {
  GraphQLObjectType,
  GraphQLFloat,
  GraphQLNonNull,
  GraphQLInt,
  GraphQLString,
  GraphQLEnumType,
} from 'graphql';
import { GraphQLContext } from '../type.js';

export enum MemberTypeId {
  BASIC,
  BUSINESS,
}

export type TypeMemberType = {
  id: MemberTypeId;
  discount: number;
  postsLimitPerMonth: number;
};

export type TypeMemberTypes = TypeMemberType[];

export const memberTypeEnum = new GraphQLEnumType({
  name: 'MemberTypeId',
  values: {
    BASIC: { value: 'BASIC' },
    BUSINESS: { value: 'BUSINESS' },
  },
});

export const memberType = new GraphQLObjectType<TypeMemberType, GraphQLContext>({
  name: 'MemberType',
  fields: () => ({
    id: {
      type: new GraphQLNonNull(memberTypeEnum),
    },
    discount: {
      type: new GraphQLNonNull(GraphQLFloat),
    },
    postsLimitPerMonth: {
      type: new GraphQLNonNull(GraphQLInt),
    },
  }),
});
