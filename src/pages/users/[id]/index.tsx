import { prisma, User } from '@/prisma'
import type { GetServerSideProps, NextPage } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/router'

type Props = {
  user: User
  now: string
}

export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
  const now = new Date().toISOString()
  // 課題１：エラー「オブジェクトは 'undefined' である可能性があります」を消すには？
  if (!ctx.params || typeof ctx.params.id !== 'string') throw new Error('400')
  const user = await prisma.user.findUnique({ where: { id: +ctx.params.id } })
  if (!user) throw new Error('404')
  // 課題２：const user: User | null の推論を、const user: User にするためには？

  return { props: { user, now } }
}

const Page: NextPage<Props> = (props) => {
  const router = useRouter()
  const handleDeleteClick = async () => {
    const res = await fetch(`/api/users/${props.user.id}`, {
      method: 'DELETE',
    })
    if (res.status == 204) {
      router.push(`/users/`)
    }
    alert('削除しました')
  }
  const handleEditClick = () => {
    router.push(`/users/${props.user.id}/edit`)
  }

  return (
    <div>
      <Link href={`/users`}>
        <a style={{ fontSize: '200px' }}>🔙</a>
      </Link>
      <h1>User</h1>
      <p style={{ color: 'red', fontSize: '50px', fontWeight: 'bolder' }}>
        user name is {props.user.name}
      </p>
      <p style={{ color: 'black', fontSize: '5px' }}>
        user id is {props.user.id}
      </p>
      <p style={{ color: 'gold', fontSize: '20px' }}>
        Email is {props.user.email}
      </p>
      {/* <button onClick={handleClick}>DELETE</button> */}
      <button
        style={{
          paddingTop: '40px',
          paddingBottom: '20px',
          color: 'white',
          backgroundColor: 'purple',
        }}
        onClick={handleDeleteClick}
      >
        DELETE
      </button>
      <Link href={`/users/${props.user.id}/edit`}>
        <button style={{ color: 'pink', fontSize: '80px' }}>Edit</button>
      </Link>

      {/* 課題３：ユーザー詳細を表示してみて */}
    </div>
  )
}

export default Page
