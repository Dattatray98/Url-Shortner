export const NavLinks = [
    { id: 1, lable: "Home" },
    { id: 2, lable: "About" },
    { id: 3, lable: "Features" },
    { id: 4, lable: "Pricing" },
]


export interface Link {
    id: number;
    originalUrl: string;
    shortUrl: string;
    shortCode: String,
}
