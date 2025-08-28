export type AnimalKey = "cat" | "dog" | "elephant";

export type BentoItem = {
    src: string;
    alt: string;
    spanCol?: number;
    spanRow?: number;
    width: number;
    height: number;
};

export type AnimalInfo = {
    title: string;
    description: string;
    facts: { label: string; value: string }[];
    photos: BentoItem[];
};

export const ANIMALS: Record<AnimalKey, AnimalInfo> = {
    cat: {
        title: "Cat",
        description:
            "Cats are small, carnivorous mammals known for their agility, curiosity, and independence.",
        facts: [
            { label: "Scientific name", value: "Felis catus" },
            { label: "Class", value: "Mammalia" },
            { label: "Order", value: "Carnivora" },
            { label: "Family", value: "Felidae" },
            { label: "Lifespan", value: "12–18 years (domestic)" },
            { label: "Diet", value: "Obligate carnivore" },
            { label: "Habitat", value: "Human-associated, global" },
            { label: "Conservation", value: "Domesticated" },
        ],
        photos: [
            { src: "https://images.unsplash.com/photo-1511044568932-338cba0ad803?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", alt: "Cat hero image", spanCol: 3, spanRow: 2, width: 1200, height: 800 },
            { src: "https://images.unsplash.com/photo-1519052537078-e6302a4968d4?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", alt: "Cat portrait", spanCol: 3, width: 800, height: 600 },
            { src: "https://plus.unsplash.com/premium_photo-1677545183884-421157b2da02?q=80&w=1172&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", alt: "Cat curled up", spanCol: 2, width: 800, height: 600 },
            { src: "https://images.unsplash.com/photo-1533738363-b7f9aef128ce?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", alt: "Playful kitten", spanCol: 2, width: 800, height: 600 },
            { src: "https://images.unsplash.com/photo-1543852786-1cf6624b9987?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", alt: "Cat sitting", spanCol: 2, spanRow: 2, width: 600, height: 800 },
            { src: "https://images.unsplash.com/photo-1478098711619-5ab0b478d6e6?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", alt: "Cat on window", spanCol: 2, width: 800, height: 600 },
            { src: "https://images.unsplash.com/photo-1596854407944-bf87f6fdd49e?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", alt: "Cat close-up", spanCol: 2, width: 600, height: 600 },
            { src: "https://images.unsplash.com/photo-1511044568932-338cba0ad803?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", alt: "Cat yawning", spanCol: 2, width: 800, height: 600 },
            { src: "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?q=80&w=1160&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", alt: "Cat outdoors", spanCol: 2, width: 800, height: 600 }
        ],
    },
    dog: {
        title: "Dog",
        description:
            "Dogs are loyal and social animals with a remarkable sense of smell.",
        facts: [
            { label: "Scientific name", value: "Canis lupus familiaris" },
            { label: "Class", value: "Mammalia" },
            { label: "Order", value: "Carnivora" },
            { label: "Family", value: "Canidae" },
            { label: "Lifespan", value: "10–13 years (varies by breed)" },
            { label: "Diet", value: "Facultative omnivore" },
            { label: "Habitat", value: "Human-associated, global" },
            { label: "Conservation", value: "Domesticated" },
        ],
        photos: [
            { src: "https://images.unsplash.com/photo-1642994495179-7c195f8923c0?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", alt: "Dog hero image", spanCol: 3, spanRow: 2, width: 1200, height: 800 },
            { src: "https://images.unsplash.com/photo-1563889958768-0fa816b019c7?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", alt: "Dog portrait", spanCol: 3, width: 800, height: 600 },
            { src: "https://images.unsplash.com/photo-1664899070837-845a92516ead?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", alt: "Dog running", spanCol: 2, width: 800, height: 600 },
            { src: "https://images.unsplash.com/photo-1485981133625-f1a03c887f0a?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", alt: "Dog with toy", spanCol: 2, width: 800, height: 600 },
            { src: "https://images.unsplash.com/photo-1568572933382-74d440642117?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", alt: "Dog standing", spanCol: 2, spanRow: 2, width: 600, height: 800 },
            { src: "https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?q=80&w=694&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", alt: "Dog on grass", spanCol: 2, width: 800, height: 600 },
            { src: "https://plus.unsplash.com/premium_photo-1666229410352-c4686b71cea2?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", alt: "Dog close-up", spanCol: 2, width: 600, height: 600 },
            { src: "https://images.unsplash.com/photo-1558929996-da64ba858215?q=80&w=1173&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", alt: "Dog yawning", spanCol: 2, width: 800, height: 600 },
            { src: "https://images.unsplash.com/photo-1444212477490-ca407925329e?q=80&w=1228&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", alt: "Dog outdoors", spanCol: 2, width: 800, height: 600 }
        ],
    },
    elephant: {
        title: "Elephant",
        description:
            "Elephants are the largest land mammals, known for intelligence and strong social bonds.",
        facts: [
            { label: "Scientific name", value: "Elephantidae (Loxodonta, Elephas)" },
            { label: "Class", value: "Mammalia" },
            { label: "Order", value: "Proboscidea" },
            { label: "Family", value: "Elephantidae" },
            { label: "Lifespan", value: "60–70 years" },
            { label: "Diet", value: "Herbivore" },
            { label: "Habitat", value: "Savannas, forests, grasslands (Africa, Asia)" },
            { label: "Conservation", value: "Endangered – Critically Endangered" },
        ],
        photos: [
            { src: "https://images.unsplash.com/photo-1578326626553-39f72c545b07?q=80&w=798&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", alt: "Elephant hero image", spanCol: 3, spanRow: 2, width: 1200, height: 800 },
            { src: "https://plus.unsplash.com/premium_photo-1666755275618-966ecd83bc5e?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", alt: "Elephant portrait", spanCol: 3, width: 800, height: 600 },
            { src: "https://plus.unsplash.com/premium_photo-1669740462478-135db9b990ea?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", alt: "Elephant herd", spanCol: 2, width: 800, height: 600 },
            { src: "https://images.unsplash.com/photo-1599921778557-082147629542?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", alt: "Elephant walking", spanCol: 2, width: 800, height: 600 },
            { src: "https://images.unsplash.com/photo-1517486430290-35657bdcef51?q=80&w=1176&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", alt: "Elephant near water", spanCol: 2, spanRow: 2, width: 600, height: 800 },
            { src: "https://plus.unsplash.com/premium_photo-1666690195791-9b812e5382b7?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", alt: "Elephant in savanna", spanCol: 2, width: 800, height: 600 },
            { src: "https://images.unsplash.com/photo-1564760055775-d63b17a55c44?q=80&w=1177&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", alt: "Elephant close-up", spanCol: 2, width: 600, height: 600 },
            { src: "https://images.unsplash.com/photo-1527161153332-99adcc6f2966?q=80&w=1169&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", alt: "Young elephant", spanCol: 2, width: 800, height: 600 },
        ],
    },
}; 