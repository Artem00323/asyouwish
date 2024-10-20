// types.ts (You can create a separate file for types)
export interface OptionType {
    value: string | number;
    label: string;
}

export interface Event {
    id: string;
    title: string;
    date: string;
    type: string;
    friendId: string;
    friendname: string;
}

export type WishlistItem = {
    id: string;
    name: string;
    image: string;
    price: number;
    contributed: number;
};

export type Wishlist = {
    id: string;
    name: string;
    date: Date;
    emoji: string;
    eventType: string; // Change this to match your existing naming convention
};
