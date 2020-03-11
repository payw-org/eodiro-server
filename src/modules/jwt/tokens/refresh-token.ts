import dayjs from 'dayjs'
import { CreateTokenOption, DecodeTokenOption, JwtToken } from './jwt-token'

export interface RefreshTokenOption {
  refreshRefreshTokenAllowedValue: number
  refreshRefreshTokenAllowedUnit: dayjs.UnitType
}

export interface DecodeRefreshTokenOption extends DecodeTokenOption {
  refreshTokenOption: RefreshTokenOption
}

export interface CreateRefreshTokenOption<T> extends CreateTokenOption<T> {
  refreshTokenOption: RefreshTokenOption
}

export class RefreshToken<T> extends JwtToken<T> {
  private refreshOption?: {
    allowedValue: number
    unit: dayjs.UnitType
  }

  constructor(config: DecodeRefreshTokenOption | CreateRefreshTokenOption<T>) {
    super(config)
  }

  isAllowedRefresh(refreshTokenOption: RefreshTokenOption): boolean {
    const refreshTokenExpireDate = dayjs.unix(this.decoded.exp)
    if (
      refreshTokenExpireDate.diff(
        dayjs(),
        refreshTokenOption.refreshRefreshTokenAllowedUnit
      ) <= refreshTokenOption.refreshRefreshTokenAllowedValue
    ) {
      return true
    } else {
      return false
    }
  }

  refreshRefreshTokenIfPossible(
    CreaterefreshTokenOption: CreateRefreshTokenOption<T>
  ): boolean {
    const isAllowed = this.isAllowedRefresh(
      CreaterefreshTokenOption.refreshTokenOption
    )
    if (isAllowed) {
      this.create(CreaterefreshTokenOption)
    }
    return isAllowed
  }
}
