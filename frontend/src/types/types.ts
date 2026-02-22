// TypeScript interfaces that match the backend MongoDB models
// Updated to match backend models: User.js, Organization.js, Pet.js, Animal.js

export interface Address {
    street?: string;
    city?: string;
    province?: string;
    postalCode?: string;
    country?: string;
}

export interface UserInfo {
    _id: string;
    name: string;
    email: string;
    password: string;
    address?: Address;
    role: 'user' | 'organization' | 'admin';
    createdAt?: Date;
    updatedAt?: Date;
}

export interface OrganizationInfo {
    _id: string;
    name: string;
    email: string;
    password: string;
    address?: Address;
    phone?: string;
    role: 'organization';
    createdAt?: Date;
    updatedAt?: Date;
}

export interface PetInfo {
    _id: string;
    name: string;
    species: string;
    breed?: string;
    sex: 'male' | 'female' | 'unknown';
    age?: number;
    owner: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface AnimalInfo {
    _id: string;
    name: string;
    species: string;
    breed?: string;
    sex: 'male' | 'female' | 'unknown';
    age?: number;
    adoptionStatus: 'available' | 'pending' | 'adopted';
    adoptedBy?: string;
    adoptionDate?: Date;
    organization: string;
    createdAt?: Date;
    updatedAt?: Date;
}
