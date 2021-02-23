import EodiroEncrypt from '@/modules/eodiro-encrypt'
import { prisma } from '@/modules/prisma'
import { sanitizePortalId } from '@/modules/sanitize-portal-id'
import { telegramBot as bot } from '@/modules/telegram-bot'
import { User } from '@prisma/client'
import TelegramBot from 'node-telegram-bot-api'

bot.onText(/\/(start|help)/, (msg) => {
  const chatId = msg.chat.id

  // send back the matched "whatever" to the chat
  bot.sendMessage(
    chatId,
    `
자랑스러운 중앙인, 환영합니다!

*/login* 커맨드를 입력하여 로그인하면 설정 끝~
  `,
    { parse_mode: 'Markdown' }
  )
})

bot.onText(/\/login/, async (msg) => {
  const chatId = msg.chat.id

  const telegramRegistration = await prisma.telegram.findFirst({
    where: {
      chatId,
    },
    include: {
      user: true,
    },
  })

  if (telegramRegistration) {
    bot.sendMessage(
      chatId,
      `
이미 다음 아이디로 로그인되어 있습니다.
${telegramRegistration.user.portalId}`
    )
    return
  }

  await bot.sendMessage(
    chatId,
    `
어디로 아이디(포탈 아이디)를 입력해주세요.
  `
  )

  let user: User

  async function pwInputListener(pw: TelegramBot.Message) {
    const chatId = pw.chat.id
    const password = pw.text

    const loggedIn = await EodiroEncrypt.isSame(password, user.password)

    if (loggedIn) {
      await prisma.telegram.upsert({
        where: {
          userId_chatId: {
            userId: user.id,
            chatId,
          },
        },
        create: {
          userId: user.id,
          chatId,
        },
        update: {
          userId: user.id,
          chatId,
        },
      })

      await bot.sendMessage(chatId, '로그인되었습니다.')
    } else {
      await bot.sendMessage(chatId, '패스워드가 틀렸습니다.')
    }

    bot.off('text', pwInputListener)
  }

  async function idInputListener(id: TelegramBot.Message) {
    const chatId = id.chat.id
    const portalId = id.text

    await bot.sendMessage(chatId, '아이디를 확인중입니다...')

    const foundUser = await prisma.user.findUnique({
      where: { portalId: sanitizePortalId(portalId) },
    })

    if (foundUser === null) {
      await bot.sendMessage(
        chatId,
        `
가입되지 않은 계정입니다.

어디로에서 회원가입 후 이용 바랍니다.

https://eodiro.com/join
`
      )
    } else {
      user = foundUser
      await bot.sendMessage(
        chatId,
        `
패스워드를 입력하세요.

p.s.
입력한 패스워드는 텔레그램 메신저 프로토콜을 통해 안전하게 전송되며 확인 후 메시지를 지우면 더욱 안전합니다.
`,
        { parse_mode: 'Markdown' }
      )
      bot.on('text', pwInputListener)
    }

    bot.off('text', idInputListener)
  }

  bot.on('text', idInputListener)
})

bot.onText(/\/logout/, async (msg) => {
  const chatId = msg.chat.id

  const telegramRegistration = await prisma.telegram.findFirst({
    where: {
      chatId,
    },
  })

  if (telegramRegistration) {
    await bot.sendMessage(chatId, '로그아웃 중입니다...')

    await prisma.telegram.delete({
      where: {
        userId_chatId: {
          userId: telegramRegistration.userId,
          chatId,
        },
      },
    })

    await bot.sendMessage(chatId, '성공적으로 로그아웃되었습니다.')
  } else {
    await bot.sendMessage(chatId, '로그인되어 있지 않습니다.')
  }
})
