export class User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  isActive: boolean;
  profileId: string;

  constructor(input: CreateUser) {
    this.id = input?.id;
    this.isActive = input?.isActive || true;
    this.email = input.email;
    this.profileId = input.profileId;
    this.firstName = input.firstName;
    this.lastName = input.lastName;
  }
}

type CreateUser = {
  firstName: string;
  lastName: string;
  email: string;
  profileId: string;
  isActive?: boolean;
  id?: string;
};
