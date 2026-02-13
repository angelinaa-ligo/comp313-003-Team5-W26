// feel free to change the user info as we go o
// this is placeholder

export interface UserInfo {
    id: string;
    username: string;
    password: string;
    confirmPassword?: string;
    email: string;
    role: 'admin' | 'junior_member' | 'member';
}