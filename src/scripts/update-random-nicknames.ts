import { User } from '@/database/models/user'
import { boot } from '@/boot'

async function run() {
  const quit = await boot({
    db: true,
    mail: true,
  })

  await User.updateRandomNickname()

  quit()
  process.exit()
}

run()
