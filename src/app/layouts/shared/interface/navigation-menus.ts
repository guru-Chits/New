declare interface MenuBaseProp {
    /**
     * Route Path
     */
    path?: string;

    /**
     * Title
     */
    title?: string;

    /**
     * Class to add
     */
    class: string;

    /**
     * Image
     */
    img: string;

    activeImg?:string;
}

export interface INavigationMenu extends MenuBaseProp {
    /**
     * Menu children
     */
    children?: MenuBaseProp[];
}
