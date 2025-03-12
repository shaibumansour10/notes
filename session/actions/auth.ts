"use server"
import { cookies } from 'next/headers'
import { deleteSession } from '../lib/session'
// import { deleteSession } from '@/app/lib/session'
 
export async function logout() {
  deleteSession()
  redirect('/login')
}