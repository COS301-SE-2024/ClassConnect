class User {
  userID: string;
  name: string;
  email: string;
  password: string;
  token: string;
  uiTheme: boolean;

  constructor(
    userID: string,
    name: string,
    email: string,
    password: string,
    token: string,
    uiTheme: boolean,
  ) {
    this.userID = userID;
    this.name = name;
    this.email = email;
    this.password = password;
    this.token = token;
    this.uiTheme = uiTheme;
  }

  getUserID(): string {
    return this.userID;
  }

  getName(): string {
    return this.name;
  }

  setName(newName: string): void {
    this.name = newName;
  }

  getEmail(): string {
    return this.email;
  }

  setEmail(newEmail: string): void {
    this.email = newEmail;
  }

  getPassword(): string {
    return this.password;
  }

  setPassword(newPassword: string): void {
    this.password = newPassword;
  }

  getToken(): string {
    return this.token;
  }

  setToken(newToken: string): void {
    this.token = newToken;
  }

  getUITheme(): boolean {
    return this.uiTheme;
  }

  setUITheme(newUITheme: boolean): void {
    this.uiTheme = newUITheme;
  }
}
