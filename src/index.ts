// Uncomment platform which you want to develop


console.log('env:')
console.log(process.env)

import DataProvider from "./data/DataProvider";



export const dataClient =  DataProvider.create()

import './render/telegram'
