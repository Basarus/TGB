import './database.js';
import sequlize from './database.js';
import './models/index.js';

await sequlize.sync()