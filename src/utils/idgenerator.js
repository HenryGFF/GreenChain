import { v4 as uuidv4 } from 'uuid';

function idMaker(){
    let id = uuidv4();

    return id;
}

export {idMaker};