import 'server-only'
 
import { cookies } from 'next/headers'
import { decrypt } from './session'
import {redirect} from 'next/navigation'

 
export const verifySession = cache(async () => {
  const cookie = (await cookies()).get('session')?.value
  const session = await decrypt(cookie)
 
  if (!session?.userId) {
    redirect('/login')
  }
 
  return { isAuth: true, userId: session.userId }
})

export const getUser = cache(async () => {
  const session = await verifySession()
  if (!session) return null
  const id = session.userId
 
  try {
    const data = await db.usersfindUnique({
      where:{
        id:session.userId??""
      },
      // Explicitly return the columns you need rather than the whole user object
      select: {
        id: true,
        name: true,
        email: true,
      },
    })
 
    const user = data[0]
 
    return user
  } catch (error) {
    console.log('Failed to fetch user')
    return null
  }
})