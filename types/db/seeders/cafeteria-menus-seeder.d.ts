declare const CafeteriaMenusSeeder: {
    (): void;
    /**
     * Seed 5 days of cafeteria menus starting from today
     */
    seed(): Promise<void>;
};
export default CafeteriaMenusSeeder;
