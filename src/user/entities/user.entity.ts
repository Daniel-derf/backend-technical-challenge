import { randomUUID } from 'crypto';

export class User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  isActive: boolean;
  profileId: string;

  constructor(input: CreateUser) {
    this.id = input?.id ?? randomUUID();
    this.isActive = input.isActive;
    this.email = input.email;
    this.profileId = input.profileId;
    this.firstName = input.firstName;
    this.lastName = input.lastName;
  }

  update(input: UpdateUser) {
    if (input.firstName !== undefined) this.firstName = input.firstName;
    if (input.lastName !== undefined) this.lastName = input.lastName;
    if (input.email !== undefined) this.email = input.email;
    if (input.profileId !== undefined) this.profileId = input.profileId;
  }

  switchStatus(newStatus: boolean) {
    if (newStatus === this.isActive)
      throw new Error(`User already has this status (${newStatus})`);

    this.isActive = newStatus;
  }
}

type CreateUser = {
  firstName: string;
  lastName: string;
  email: string;
  profileId: string;
  isActive: boolean;
  id?: string;
};

type UpdateUser = Partial<CreateUser>;
