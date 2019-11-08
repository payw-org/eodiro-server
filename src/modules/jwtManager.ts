import AccessToken from '@/modules/accessToken'
import RefreshToken from '@/modules/refreshToken'
import { Payload } from '@/modules/jwtToken'
import RefreshTokenFromDB from '@/db/RefreshTokenFromDB'
export interface Tokens {
    accessToken: string
    refreshToken: string
}

export default class JwtManager {

    static async getToken(userId: number): Promise<Tokens> {
        const payload = { userId }
        const result = {} as Tokens
        const accessToken = new AccessToken()
        await accessToken.create(payload)
        result.accessToken = accessToken.token
        const row = await RefreshTokenFromDB.findWithUserId(userId)
        if (row === false || row === undefined) { // no refresh token in db 
            const refreshToken = new RefreshToken()
            console.log(payload)
            await refreshToken.create(payload)
            await RefreshTokenFromDB.addRefreshToken(refreshToken)
            result.refreshToken = refreshToken.token
        } else {
            try {
                const refreshToken = new RefreshToken(row.token)
                await refreshToken.verify()
                if (await refreshToken.refreshRefreshTokenIfPossible()) {
                    // refreshToken is refreshed 
                    await RefreshTokenFromDB.updateRefreshToken(refreshToken)
                }
                result.refreshToken = refreshToken.token
            } catch (err) {
                const refreshToken = new RefreshToken()
                await refreshToken.create(payload)
                await RefreshTokenFromDB.updateRefreshToken(refreshToken)
                result.refreshToken = refreshToken.token
            }
        }
        return result
    }

    static async refresh(token: string): Promise<Tokens> {
        const result = {} as Tokens
        const refreshToken = new RefreshToken(token)
        await refreshToken.verify()
        const row = await RefreshTokenFromDB.findWithUserId(refreshToken.decoded.payload.userId)
        if (row === false || row === undefined) {
            throw new Error('no refersh token in db')
        } else if (row.manually_changed_at > refreshToken.decoded.iat) {
            throw new Error('refersh token is created before being manually changed')
        }
        if (await refreshToken.refreshRefreshTokenIfPossible()) {
            await RefreshTokenFromDB.updateRefreshToken(refreshToken)
        }
        result.refreshToken = refreshToken.token
        const accessToken = new AccessToken()
        await accessToken.create(refreshToken.decoded.payload)
        result.accessToken = accessToken.token
        return result
    }
}

