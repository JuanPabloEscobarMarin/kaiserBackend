interface User {
    id: string;
}

export interface UserDatabase {
    all: () => Promise<User[]>;
    byId: (id: string) => Promise<User>;
    save: (user: UserCreateParams) => Promise<User>;
    update: (id: string, user: UserUpdateParams) => Promise<User>;
    delete: (id: string) => Promise<User>
}