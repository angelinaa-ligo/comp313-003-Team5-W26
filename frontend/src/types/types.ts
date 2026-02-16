// feel free to change the interfaces as we go on
// this is placeholder
// just dm ethan when you do so, so i can update the frontend accordingly

export interface UserInfo {
    id: string;
    username: string;
    password: string;
    confirmPassword?: string;
    email: string;
    role: 'admin' | 'junior_member' | 'member';
}

export interface PetInfo {
    id: string;
    name: string;
    type: string;
    breed?: string;
    gender: 'male' | 'female' | 'unknown';
    age: number;
    vaccinated: boolean;
    description?: string;
    medicalHistory?: string;
    imageUrl: string;
    adoptionStatus: 'available' | 'pending' | 'adopted' | 'own';
}