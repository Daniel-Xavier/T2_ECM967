import { createPubSub } from "graphql-yoga";

const pubsub = createPubSub();

export const typeDefs = /* GraphQL */ `
  enum Categorias {
    CINEMA
    GEREL
    ESPORTES
  }

  type Usuario {
    login: String!
    senha: String
    inscricao: [String]
  }

  type Mensagem {
    mensagem: String!
    timestamp: String!
    usuario: Usuario!
  }

  type Chat {
    categorias: Categorias!
    mensagem: [Mensagem]
  }

  type Inscricoes {
    cinema: Int!
    geral: Int!
    esportes: Int!
  }

  type Log {
    operation: String!
    fieldName: String!
    timestamp: String!
  }

  type Query {
    chat: [Chat]

    usuarios: [Usuario]

    mensagem: [Mensagem]

    inscricoes: Inscricoes

    logs: [Log]
  }

  type Mutation {
    
    createUsuario(login: String!, senha: String!): Usuario
 
    createMensagem(
      Mensagem: String!
      login: String!
      categorias: Categorias!
    ): Mensagem

    inscricaoUsuario(login: String!, categorias: Categorias!): Usuario
  }

  type Subscription {

    inscricaoChat(categorias: Categorias!): Mensagem
  }

`;
