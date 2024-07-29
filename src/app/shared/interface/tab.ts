export interface ITab {
    /**
     * Title
     */
    title: string;

    /**
     * Code
     */
    code: string;
  
    /**
     * Class to add
     */
    class: string;

    /**
     * Active
     */
    active?: boolean;

    /**
     * Action
     */
    action: boolean;

    actKey: string;
    
}