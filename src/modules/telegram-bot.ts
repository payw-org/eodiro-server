import env from '@/env'
import TelegramBot from 'node-telegram-bot-api'

const token = env.TELEGRAM_BOT_TOKEN
export const telegramBot = new TelegramBot(token, { polling: true })
