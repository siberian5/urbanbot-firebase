import {DataClient} from '../DataProvider'
import FirebaseData, {ModelOps, Task, WithDate} from './FirebaseData'

/*
    Это высокоуровневый интерфейс БД.
    Эти функции предназначены для использования логикой бота/админкой сайта.
    Некоторые из этих функций передают работу низкоуровневым функциям,
    другие (см addNewTask) при своём выполнении дёргают по нескольку
    низкоуровневых функций (и совершают по нескольку сетевых вызовов).
 */

export const addNewTask = (firestoreOps: ModelOps) => async (task : Task ) => {

    const userId = task.userId!
    const counterVal = await firestoreOps.getCounter(userId)

    const nextVal = counterVal+ 1

    const taskWithDate = task as unknown as Task & WithDate

    taskWithDate.name = '/task'+nextVal
    taskWithDate.time = new Date()
    taskWithDate.done = false

    await firestoreOps.addTask(taskWithDate)
    await firestoreOps.setCounter(userId, nextVal)

    return nextVal
}


export const listAllUserTasks = (firestoreOps: ModelOps) => async (userId : number, limit: number) => {
    return firestoreOps.listAllUserTasks(userId, limit)
}

export const listUnfinishedUserTasks = (firestoreOps: ModelOps) => async (userId : number, limit: number) => {
    return firestoreOps.listUnfinishedUserTasks(userId, limit)
}

export const getTaskByName = (firestoreOps: ModelOps) => async (userId : number, taskName: string) => {
    return firestoreOps.getTaskByName(userId, taskName)
}

export async function create(data: DataClient) {
    const firebaseModel = await FirebaseData.create(data)

    return {
        listAllUserTasks: listAllUserTasks(firebaseModel),
        listUnfinishedUserTasks: listUnfinishedUserTasks(firebaseModel),
        addNewTask: addNewTask(firebaseModel),
        getTaskByName: getTaskByName(firebaseModel)
    }
}

export default { create }