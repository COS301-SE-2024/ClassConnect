import { User } from './User';

abstract class Authentication {
  private user: User;
  private successor: Authentication | null;

  public constructor(user: User, successor: Authentication | null) {
    this.user = user;
    this.successor = successor;
  }

  public setAuthentication(newSuccessor: Successor): void {
    this.successor = newSuccessor;
  }

  abstract handleRequest(token: string): void;
}

export { Authentication };
