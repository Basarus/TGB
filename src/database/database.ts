import { Sequelize } from "sequelize";

let sequlize: Sequelize | null = null;

export async function load(){
    sequlize = new Sequelize(
        'foodlover',
        'postgres',
        'postgres',
        {
            dialect: 'postgres',
            host: 'localhost',
            port: 5432
        }
    )

    try{
        await sequlize.authenticate();
        console.log('Database: Load')
    } catch(e){
        console.log(e)
        process.exit()
    }
}

await load()

export default sequlize;