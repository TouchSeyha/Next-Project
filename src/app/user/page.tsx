import { prisma } from '@/lib/prisma'
import React from 'react'

export default async function User() {

  const users = await prisma.user.findMany();

  return (
    <div>
      <h1>User</h1>
      <p>List of users</p>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            {user.name} - {user.email}
          </li>
        ))}
      </ul>
    </div>
  )
}
