import Axios from 'axios'
import Config from '@/config'

type PushInformation = {
  /**
   * ExpoPushToken
   */
  to: string
  title: string
  body: string
  data?: object
  sound?: 'default'
  /**
   * @default true
   */
  _displayInForeground?: boolean
}

type PushPayload = PushInformation | PushInformation[]

export default class Push {
  private static initPayload(payload: PushPayload) {
    function initInfo(info: PushInformation) {
      if (!info.sound) {
        info.sound = 'default'
      }

      if (!info._displayInForeground) {
        info._displayInForeground = true
      }
    }

    if (Array.isArray(payload)) {
      payload.forEach((p) => {
        initInfo(p)
      })
    } else {
      initInfo(payload)
    }
  }

  static async notify(payload: PushPayload) {
    this.initPayload(payload)

    const response = await Axios({
      method: 'POST',
      url: Config.PUSH_API_URL,
      headers: {
        Accept: 'application/json',
        'Accept-encoding': 'gzip, deflate',
        'Content-Type': 'application/json',
      },
      data: JSON.stringify(payload),
    })

    return response
  }
}
