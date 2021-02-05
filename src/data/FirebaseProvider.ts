
import Config from '../Config'
import firebase from 'firebase'

export function create() {

    return  firebase.initializeApp({
        apiKey: Config.Firebase.apiKey,
        authDomain: Config.Firebase.authDomain,
        projectId: Config.Firebase.projectId,
        storageBucket: Config.Firebase.storageBucket,
        messagingSenderId: Config.Firebase.messagingSenderId
    })

}

export default { create }