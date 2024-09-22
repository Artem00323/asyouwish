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