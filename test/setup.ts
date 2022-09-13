import { rm } from "fs/promises"
import { join } from "path"
import { promises } from 'fs';


global.beforeEach(async () => {
    try {
        await rm(join(__dirname, '..', 'test.sqlite'));
    } catch (error) {}
});

