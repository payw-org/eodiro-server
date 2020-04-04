import { InitOptions, Model, ModelAttributes } from 'sequelize'
import { Database } from './index'

class ExtendedModel extends Model {}

/**
 * Return the Model class after the initialization
 * @param modelClass A model class that extends Sequelize Model
 * @param modelName Table name
 * @param modelAttributes Table attributes
 * @param initOptions
 */
export const createInitModelFunction = <T extends typeof ExtendedModel>(
  modelClass: T,
  modelName: string,
  modelAttributes: ModelAttributes,
  initOptions?: Omit<InitOptions, 'modelName' | 'sequelize'>
) => {
  return async function () {
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
