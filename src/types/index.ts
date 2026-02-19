export interface Portofolio {
    id: number;
    title: string;
    description: string;
    imageUrl: string;
    link: string;
    tags: Tag[];
    createdAt: Date;
    updatedAt: Date;
}

interface Tag {
    id: number;
    name: string;
}
