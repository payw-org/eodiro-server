import { InitOptions, Model, ModelAttributes } from 'sequelize'
import { Database } from './index'

class ExtendedModel extends Model {}

export const createGetModelFunction = <T extends typeof ExtendedModel>(
  modelClass: T,
  modelName: string,
  modelAttributes: ModelAttributes,
  initOptions?: Omit<InitOptions, 'modelName' | 'sequelize'>
) => {
  return async function() {
    if (modelClass.options) {
      return modelClass
    } else {
      const sequelize = await Database.getSequelize()
      modelClass.init(modelAttributes, {
        modelName,
        sequelize,
        ...initOptions,
      })

      return modelClass
    }
  }
}
