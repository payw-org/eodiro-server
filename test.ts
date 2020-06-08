import prisma from './src/modules/prisma'

async function run() {
  const users = await prisma.noticeNotificationsSubscription.findMany({
    where: {
      noticeKey: 'cse',
    },
    include: {
      user: {
        select: {
          devices: true,
        },
      },
    },
  })

  console.log(JSON.stringify(users, null, 2))

  console.log(
    JSON.stringify(
      users.reduce(
        (accum, curr) => [
          ...accum,
          ...curr.user.devices.map((device) => device.pushToken),
        ],
        []
      ),
      null,
      2
    )
  )

  prisma.disconnect()
}

run()
