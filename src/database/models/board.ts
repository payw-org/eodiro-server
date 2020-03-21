import { DataTypes, Model } from 'sequelize'
import { createGetModelFunction } from '../create-model-function'
import { PrimaryAIAttribute } from '../utils/model-attributes'

class Board extends Model {}

export const getBoard = createGetModelFunction(
  Board,
  'board',
  {
    id: PrimaryAIAttribute,
    board_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
  },
  {
    indexes: [
      {
        unique: true,
        fields: ['board_name'],
      },
    ],
  }
)

export type BoardType = {
  id: number
  board_name: string
}
