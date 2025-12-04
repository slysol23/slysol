// Define the Author interfaces
export interface ICreateAuthor {
  firstName: string;
  lastName: string;
  email: string;
}

export interface IUpdateAuthor {
  firstName?: string;
  lastName?: string;
  email?: string;
}
