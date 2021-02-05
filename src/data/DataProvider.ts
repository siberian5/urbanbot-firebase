
import FirebaseProvider from './FirebaseProvider'
import firebase from 'firebase'
import App = firebase.app.App

/*
 Этот модуль собирает все подключения ко всем базам.
 В данном случае используется лишь одна база.
 */



export interface DataClient {
    firebase: App
}

export async function create(): Promise<DataClient> {
    return {
        firebase: await FirebaseProvider.create()
    }
}

export default { create }