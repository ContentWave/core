import { IWaveProject, getWaveProjectModel } from '../models/WaveProject'

interface IProject {
  name: string
}

const cache: { [key: string]: IProject } = {}

export class Projects {
  static async retrieveProjectsFromDb () {
    const projects: IWaveProject[] = await getWaveProjectModel().find({})
    for await (const project of projects) {
      cache[project.key] = {
        name: project.name
      }
    }
  }

  static projectExists (key: string): boolean {
    return cache[key] !== undefined
  }

  static async create (name: string, key: string): Promise<boolean> {
    const created = await getWaveProjectModel().create({
      name,
      key
    })
    if (!created) return false
    cache[created.key] = { name: created.name }
    return true
  }

  static async update (key: string, name: string) {
    const res = await getWaveProjectModel().updateOne(
      { key },
      { $set: { name } }
    )
    if (res?.modifiedCount && cache[key] !== undefined) cache[key].name = name
  }

  static async delete (key: string) {
    const res = await getWaveProjectModel().deleteOne({
      key
    })
    if (res?.deletedCount && cache[key] !== undefined) {
      delete cache[key]
    }
  }
}
