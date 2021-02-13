export declare type College = {
    college: string;
    majors: {
        majorName: string;
        majorCode: string;
    }[];
};
declare const collegesMajorsSeeder: (colleges: College[]) => Promise<void>;
export default collegesMajorsSeeder;
