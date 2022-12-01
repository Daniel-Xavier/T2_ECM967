import { createPubSub } from "graphql-yoga";
import { db } from "./db";

const pubsub = createPubSub();

export const resolvers = {
  Query: {
    chat: () => db.chat,
    usuarios: () => db.usuarios,
    mensagem: () => db.chat.flatMap((room) => room.mensagem),
    inscricoes: () => ({
      cinema: db.usuarios.filter((usuario) => usuario.inscricao.includes("CINEMA"))
        .length,
      geral: db.usuarios.filter((usuario) => usuario.inscricao.includes("GERAL"))
        .length,
      esportes: db.usuarios.filter((usuario) => usuario.inscricao.includes("ESPORTES"))
        .length,
    }),
    logs: () => db.logs,
  },
  Mutation: {
    createUsuario: (parent: any, args: any, context: any, info: any) => {
      const usuario = {
        login: args.login,
        senha: args.senha,
        inscricao: [],
      };

      if (db.usuarios.find((usuario: any) => usuario.login === args.login)) {
        return new Error("User already exists");
      } else {
        db.usuarios.push(usuario);
        return usuario;
      }
    },

    createMensagem: (parent: any, args: any, context: any, info: any) => {
      if (!db.usuarios.find((usuario: any) => usuario.login === args.login)) {
        return new Error("User does not exist");
      }
      if (!db.chat.find((room: any) => room.categorias === args.categorias)) {
        return new Error("Chat room does not exist");
      }
      if (args.mensagem.length > 500) {
        return new Error("Message is too long");
      }

      const mensagem = {
        mensagem: args.mensagem,
        timestamp: new Date().toISOString(),
        usuario: db.usuarios.find((usuario: any) => usuario.login === args.login),
      };

      db.chat
        .find((chat: any) => chat.categorias === args.categorias)
        .mensagem.push(mensagem);
      pubsub.publish(args.categorias, mensagem);
      return mensagem;
    },
  },
  Subscription: {
    inscricaoChat: {
      subscribe: (parent: any, args: any, context: any, info: any) => {
        db.usuarios.find(
          (usuario: any) => usuario.login === args.login
        ).inscricao = [
          ...new Set([
            ...db.usuarios.find((usuario: any) => usuario.login === args.login)
              .inscricao,
            args.categorias,
          ]),
        ];
        return pubsub.subscribe(args.categorias);
      },
      resolve: (payload: any) => {
        return payload;
      },
    },
  },
};
