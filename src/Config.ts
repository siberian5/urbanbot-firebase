export namespace Telegram {
  export const token = process.env.BOTTOKEN || 'telegram-token-is-not-provided'
}

export namespace Server {
  export const port = Number(process.env.PORT || '4000')
  export const isDev = process.env.NODE_ENV === 'development'
}

export namespace Firebase {
  export const apiKey = process.env.FIREBASE_API_KEY || 'not-provided'
  export const authDomain = process.env.FIREBASE_AUTH_DOMAIN || 'not-provided'
  export const projectId = process.env.FIREBASE_PROJECT_ID || 'not-provided'
  export const storageBucket = process.env.FIREBASE_STORAGE_BUCKET || 'not-provided'
  export const messagingSenderId = process.env.FIREBASE_MESSAGING_SENDER_ID || 'not-provided'
  export const appId = process.env.FIREBASE_APP_ID || 'not-provided'
  // export const databaseUrl = process.env.FIREBASE_DATABASE_URL || 'not-provided'
}


export default { Firebase, Server, Telegram }
