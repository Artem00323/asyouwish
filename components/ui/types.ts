// types.ts (You can create a separate file for types)
export interface OptionType {
    value: string | number;
    label: string;
}

export type Event = {
    id: string;
    title: string;
    date: Date;
    type: 'birthday' | 'event';
    friendId: string;
};

export type WishlistItem = {
    id: string;
    name: string;
    image: string;
    price: number;
    contributed: number;
};