import { DataTypes, Model } from 'sequelize'
import { createModelFunction } from '../create-model-function'
import { PrimaryAIAttribute } from '../utils/model-attributes'

class Board extends Model {}

export const board = createModelFunction(
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
        fields: ['board_name'],
      },
    ],
  }
)

export type BoardType = {
  id: number
  board_name: string
}
