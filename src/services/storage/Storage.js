import React from 'react';
import { AsyncStorage } from 'react-native'

class Storage {
    data = ''
    storageName = ''

    async persist(previousData) {
      let dataToPersist = new Array()
      if (previousData != undefined) {
        dataToPersist = previousData
      }
      dataToPersist.push(this.data)
      let result = false
      try {
        await AsyncStorage.setItem(this.storageName, JSON.stringify(dataToPersist))
        return true;
      } catch (error) {
        console.log(error)
      }
      return result
    }

    async append() {
      let dataToPersist = await this.loadAll()
      return await this.persist(dataToPersist)
    }

    async loadAll() {
      let modelString = await AsyncStorage.getItem(this.storageName)
      return (!modelString) ? [] : JSON.parse(modelString);
    }

}

module.exports = Storage;
