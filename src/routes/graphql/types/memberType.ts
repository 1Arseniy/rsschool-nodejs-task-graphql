import {
  GraphQLObjectType,
  GraphQLFloat,
  GraphQLNonNull,
  GraphQLInt,
  GraphQLString,
  GraphQLEnumType,
} from 'graphql';

export enum MemberTypeId {
  BASIC = 1,
  BUSINESS = 2,
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
    BASIC: {
      value: 1,
    },
    BUSINESS: {
      value: 2,
    },
  },
});

export const memberType = new GraphQLObjectType({
  name: 'memberType',
  fields: () => ({
    id: {
      type: new GraphQLNonNull(GraphQLString),
    },
    discount: {
      type: new GraphQLNonNull(GraphQLFloat),
    },
    postsLimitPerMonth: {
      type: new GraphQLNonNull(GraphQLInt),
    },
  }),
});
