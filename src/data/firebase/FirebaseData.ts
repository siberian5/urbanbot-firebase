import { DataClient } from '../DataProvider'
import firebase from 'firebase'
import Firestore = firebase.firestore.Firestore
import Timestamp = firebase.firestore.Timestamp

/*

    Это низкоуровневый интерфейс базы данных.
    Все запросы прописаны здесь.

 */

export type ModelOps = {
    getCounter: ReturnType<typeof getCounter>
    setCounter: ReturnType<typeof setCounter>
    listUnfinishedUserTasks: ReturnType<typeof listUnfinishedUserTasks>
    listAllUserTasks: ReturnType<typeof listAllUserTasksLimited>
    addTask: ReturnType<typeof addTask>
    getTaskByName: ReturnType<typeof getTaskByName>
}

export type UserId = number

export type Task = {
    description: string
    done?: boolean
    name?: string
    userId?: UserId
}
export type WithDate = {
    time: Date
}
export type WithTimestamp = {
    time: Timestamp
}

export const listUnfinishedUserTasks = (firestore: () => Firestore) => async (id: UserId, limit: number) => {
    const tasksSnapshot = await firestore()
        .collection('tasks')
        .where('userId', '==', id )
        .where('done', '==', false)
        .orderBy('time', 'desc' )
        .limit(limit)
        .get()

    const result: (Task & WithDate)[] = []

    if (tasksSnapshot.empty) {
        return result
    }

    tasksSnapshot.forEach(taskHolder => {
        const taskData = taskHolder.data()
        // console.log(taskHolder.id, '=>', taskHolder.data());
        result.push({description: taskData.description,
            done: taskData.done,
            time: taskData.time.toDate(),
            name: taskData.name,
        })
    })

    return result
}

// Специальный индеск создан в файрбейсе для этого запроса
export const listAllUserTasksLimited = (firestore: () => Firestore) => async (id: UserId, limit: number) => {

    const tasksSnapshot = await firestore()
        .collection('tasks')
        .where('userId', '==', id )
        .orderBy('time', 'desc' )
        .limit(limit)
        .get()

    const result: (Task & WithDate)[] = []

    if (tasksSnapshot.empty) {
        return result
    }

    tasksSnapshot.forEach(taskHolder => {
        const taskData = taskHolder.data()
        // console.log(taskHolder.id, '=>', taskHolder.data());
        result.push({description: taskData.description,
                     done: taskData.done,
                     time: taskData.time.toDate(),
                     name: taskData.name,
        })
    })

    return result
}

// todo
export const getTaskByName = (firestore: () => Firestore) => async (id: UserId, taskName: string)
    :Promise<Task & WithDate | null> => {

    const tasksSnapshot = await firestore()
        .collection('tasks')
        .where('userId', '==', id )
        .where('name', '==', taskName)
        .get()


    if (tasksSnapshot.empty) {
        return null
    }

    let result: (Task & WithDate)[] = []

    // там только один агрегат

    tasksSnapshot.forEach(taskHolder => {
        const taskData = taskHolder.data()

        result.push({description: taskData.description,
            done: taskData.done,
            time: taskData.time.toDate(),
            name: taskData.name,
        })
    })

    return result[0]
}

export const addTask = (firestore: () => Firestore) => async (task: Task & WithDate) => {

    const date = task.time
    const taskTS : Task & WithTimestamp = task as unknown as (Task & WithTimestamp)
    taskTS.time = Timestamp.fromDate(date)

    await firestore().collection('tasks').add(taskTS)
}

export const getCounter = (firestore: () => Firestore) => async (id: UserId)
    :Promise<number> => {

    const docRef = await firestore().collection('counters').doc(id.toString())
    const doc = await docRef.get()

    if (!doc.exists) {
        return 0
    }

    return doc.data()!.counter
}

export const setCounter = (firestore: () => Firestore) => async (id: UserId, counter: number) => {

    await firestore().collection('counters').doc(id.toString()).set({counter: counter})

}

export async function create(client: DataClient): Promise<ModelOps> {

    const firestore = () => client.firebase.firestore()

    return {
        getCounter: getCounter(firestore),
        setCounter: setCounter(firestore),
        listAllUserTasks: listAllUserTasksLimited(firestore),
        listUnfinishedUserTasks: listUnfinishedUserTasks(firestore),
        addTask: addTask(firestore),
        getTaskByName: getTaskByName(firestore)
    }
}

export default { create }
