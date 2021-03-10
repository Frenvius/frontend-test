type Drone = {
    [index: string]: string | number;
    id: number;
    image: string;
    name: string;
    address: string;
    battery: number;
    max_speed: number;
    average_speed: number;
    status: string;
    fly: number;
    currentFly: string;
};

export type { Drone };